const express = require('express');
const authControllers = require('../controllers/auth.controllers');

const { body, header } = require('express-validator');

const router = express.Router();

router.post(
  '/register',
  [
    body('email').isEmail().withMessage('รูปแบบอีเมลไม่ถูกต้อง'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('รหัสผ่านต้องไม่น้อยกว่า 6 อักขระ'),
  ],
  authControllers.register
);
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('รูปแบบอีเมลไม่ถูกต้อง'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('รหัสผ่านต้องไม่น้อยกว่า 6 อักขระ'),
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
