const db = require('../models/index');
const { verifyExpires } = require('./verifyExpires');
const { client } = require('../helpers/createRedis');
const crypto = require('crypto');

exports.compareSignature = async (tokenId, signatureClient) => {
  await client.connect();
  const value = await client.hGetAll(tokenId);
  await client.disconnect();

  if (JSON.stringify(value) === JSON.stringify({})) {
    throwError(404, 'ไม่มี Token ใน Redis');
  }

  const { expires, secretKey, accountId } = value;

  if (!verifyExpires(expires)) {
    throwError(401, 'Token Redis หมดอายุ');
  }

  let account = null;

  if (!accountId) {
    throwError(404, 'ไม่พบ Account ID ใน Key Redis');
  }

  await db.Account.findOne({
    where: { id: accountId },
  })
    .then((accountData) => {
      if (!accountData) {
        throwError(404, 'ไม่พบ Account ใน Database');
      }
      const password = accountData.password;
      const signatureRedisData = `${tokenId}:${expires}:${password}:${secretKey}`;

      const hash = crypto.createHash('sha256');
      hash.update(signatureRedisData);
      const signatureRedis = hash.digest('hex');
      if (signatureClient === signatureRedis) {
        account = Object.assign({}, accountData.dataValues);
        delete account.password;
      }
    })
    .catch((error) => {
      next(error);
    });

  return account;
};
