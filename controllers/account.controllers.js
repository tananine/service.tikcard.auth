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

    res.status(200).json({ email: account.email, tutorial: tutorial });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getData,
};
