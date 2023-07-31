const express = require('express');
const authControllers = require('../controllers/auth.controllers');

const { body, header } = require('express-validator');

const router = express.Router();

router.post(
  '/register',
  [
    body('email')
      .trim()
      .toLowerCase()
      .isEmail()
      .withMessage('รูปแบบอีเมลไม่ถูกต้อง')
      .isLength({ max: 80 })
      .withMessage('อีเมลต้องไม่เกิน 80 อักขระ'),
    body('password')
      .trim()
      .isLength({ min: 6, max: 28 })
      .withMessage('รหัสผ่านต้องมี 6 ถึง 28 อักขระ'),
  ],
  authControllers.register
);
router.post(
  '/login',
  [
    body('email')
      .trim()
      .toLowerCase()
      .isEmail()
      .withMessage('รูปแบบอีเมลไม่ถูกต้อง')
      .isLength({ max: 80 })
      .withMessage('อีเมลต้องไม่เกิน 80 อักขระ'),
    body('password')
      .trim()
      .isLength({ min: 6, max: 28 })
      .withMessage('รหัสผ่านต้องมี 6 ถึง 28 อักขระ'),
  ],
  authControllers.login
);
router.get(
  '/authentication',
  header('Authorization')
    .notEmpty()
    .withMessage('ไม่มี Authorization ใน Header'),
  authControllers.authentication
);

module.exports = router;
