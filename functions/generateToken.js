const { client } = require('../functions/createRedis');
const { v4: uuidv4 } = require('uuid');
const randomKey = require('random-key');
const date = require('date-and-time');
const crypto = require('crypto');

exports.generateToken = async (accountData) => {
  const randomTokenId = uuidv4();
  const randomSecretKey = randomKey.generate();
  const now = new Date();
  const expires = date.addDays(now, 14).getTime();
  const signatureData = `${randomTokenId}:${expires}:${accountData.password}:${randomSecretKey}`;

  const hash = crypto.createHash('sha256');
  hash.update(signatureData);
  const signature = hash.digest('hex');

  const tokenData = `${randomTokenId}:${expires}:${signature}`;
  const token = Buffer.from(tokenData).toString('base64');

  await client.hSet(randomTokenId, 'expires', expires);
  await client.hSet(randomTokenId, 'secretKey', randomSecretKey);
  await client.hSet(randomTokenId, 'accountId', accountData.id);

  return token;
};
