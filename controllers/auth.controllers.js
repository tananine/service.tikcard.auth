const { validationResult } = require('express-validator');
const { throwError } = require('../functions/throwError');
const { generateToken } = require('../functions/generateToken');
const { verifyExpires } = require('../functions/verifyExpires');
const { compareSignature } = require('../functions/compareSignature');
const db = require('../models/index');
const bcrypt = require('bcryptjs');

const register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const email = req.body.email;
  const password = req.body.password;

  db.Account.findOne({ where: { email: email } })
    .then((account) => {
      if (account) {
        throwError(400, 'อีเมลนี้ถูกใช้งานแล้ว');
      }
      return bcrypt.hash(password, 12);
    })
    .then((hashPassword) => {
      const account = db.Account.build({
        email: email,
        password: hashPassword,
        status: 'personal',
      });
      return account.save();
    })
    .then((account) => {
      res
        .status(201)
        .json({ message: 'สร้าง Account สำเร็จ', email: account.email });
    })
    .catch((error) => {
      next(error);
    });
};

const login = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const email = req.body.email;
  const password = req.body.password;

  let accountData;

  db.Account.findOne({
    where: { email: email },
  })
    .then((account) => {
      if (!account) {
        throwError(400, 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      }
      accountData = account;
      return bcrypt.compare(password, accountData.password);
    })
    .then(async (isEqual) => {
      if (!isEqual) {
        throwError(400, 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      }
      const token = await generateToken(accountData);
      res.status(200).json({ message: 'เข้าสู่ระบบสำเร็จ', token: token });
    })
    .catch((error) => {
      next(error);
    });
};

const authentication = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const bearerToken = req.headers.authorization;
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
  compareSignature(tokenId, signature)
    .then((account) => {
      if (!account) {
        throwError(401, 'Token ไม่ถูกต้อง');
      }
      res.status(200).json(account);
    })
    .catch((error) => {
      next(error);
    });
};

module.exports = {
  register,
  login,
  authentication,
};
