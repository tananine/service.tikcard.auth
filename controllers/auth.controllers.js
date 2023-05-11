const { validationResult } = require('express-validator');
const { throwError } = require('../functions/throwError');
const { generateToken } = require('../functions/generateToken');
const { auth } = require('../functions/auth');
const db = require('../models/index');
const bcrypt = require('bcryptjs');

const register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throwError(400, errors.array()[0].msg, errors.array(), true);
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
    throwError(400, errors.array()[0].msg, errors.array(), true);
  }

  const email = req.body.email;
  const password = req.body.password;

  let accountData;

  db.Account.findOne({
    where: { email: email },
  })
    .then((account) => {
      if (!account) {
        throwError(400, 'อีเมลหรือรหัสผ่านไม่ถูกต้อง', {}, true);
      }
      accountData = account;
      return bcrypt.compare(password, accountData.password);
    })
    .then(async (isEqual) => {
      if (!isEqual) {
        throwError(400, 'อีเมลหรือรหัสผ่านไม่ถูกต้อง', {}, true);
      }
      const token = await generateToken(accountData);
      res.status(200).json({ message: 'เข้าสู่ระบบสำเร็จ', token: token });
    })
    .catch((error) => {
      next(error);
    });
};

const authentication = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throwError(400, errors.array()[0].msg, errors.array(), true);
  }

  try {
    const account = await auth(req.headers.authorization);
    res.status(200).json(account);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  authentication,
};
