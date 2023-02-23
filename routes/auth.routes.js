const express = require('express');
const authControllers = require('../controllers/auth.controllers');

const { body, header } = require('express-validator');

const router = express.Router();

router.post(
  '/register',
  [body('email').isEmail(), body('password').isLength({ min: 6, max: 15 })],
  authControllers.register
);
router.post(
  '/login',
  [body('email').isEmail(), body('password').isLength({ min: 6, max: 15 })],
  authControllers.login
);
router.get(
  '/authentication',
  header('Authorization').notEmpty(),
  authControllers.authentication
);

module.exports = router;
