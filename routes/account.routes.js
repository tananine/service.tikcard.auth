const express = require('express');
const accountControllers = require('../controllers/account.controllers');

const { header } = require('express-validator');

const router = express.Router();

router.get(
  '/data',
  header('Authorization')
    .notEmpty()
    .withMessage('ไม่มี Authorization ใน Header'),
  accountControllers.getData
);

module.exports = router;
