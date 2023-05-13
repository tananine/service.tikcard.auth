const { validationResult } = require('express-validator');
const { throwError } = require('../functions/throwError');
const { auth } = require('../functions/auth');
const db = require('../models/index');

const getData = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throwError(400, errors.array()[0].msg, errors.array(), false);
    }
    const account = await auth(req.headers.authorization);
    const accountId = account.id;

    const [tutorial] = await db.Tutorial.findOrCreate({
      where: { accountId: accountId },
      defaults: {
        accountId: accountId,
      },
      attributes: { exclude: ['id', 'accountId'] },
    });

    return res.status(200).json({ email: account.email, tutorial: tutorial });
  } catch (error) {
    next(error);
  }
};

const successTutorial = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throwError(400, errors.array()[0].msg, errors.array(), false);
    }
    const account = await auth(req.headers.authorization);
    const accountId = account.id;
    const tutorial = req.body.tutorial;

    db.Tutorial.update(
      { [tutorial]: true },
      { where: { accountId: accountId } }
    ).then((update) => {
      if (!update) {
        throwError(
          400,
          'อัพเดทไม่สำเร็จ',
          {
            accountId: accountId,
          },
          false
        );
      }
      return res.status(200).json({ message: 'อัพเดทสำเร็จ' });
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getData,
  successTutorial,
};
