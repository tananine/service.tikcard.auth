const express = require('express');
const accountControllers = require('../controllers/account.controllers');

const router = express.Router();

router.get('/data', accountControllers.getData);

module.exports = router;
