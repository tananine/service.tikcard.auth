const { throwError } = require('./throwError');
const { verifyExpires } = require('./verifyExpires');
const { compareSignature } = require('./compareSignature');

exports.auth = (bearerTokenHeader) => {
  const bearerToken = bearerTokenHeader;
  const token = bearerToken.split(' ')[1];
  const buff = Buffer.from(token, 'base64');
  const decodeToken = buff.toString('ascii').split(':');
  const tokenId = decodeToken[0];
  let expires = decodeToken[1];
  const signature = decodeToken[2];

  if (!(tokenId && expires && signature)) {
    throwError(401, 'รูปแบบ Token ไม่ถูกต้อง');
  }
  if (!verifyExpires(expires)) {
    throwError(401, 'Token Client หมดอายุ');
  }
  return compareSignature(tokenId, signature)
    .then((account) => {
      if (!account) {
        throwError(401, 'Token ไม่ถูกต้อง');
      }
      return account;
    })
    .catch((error) => {
      throw error;
    });
};
