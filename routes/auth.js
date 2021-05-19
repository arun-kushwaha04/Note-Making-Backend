const express = require('express');
const { signUp, login } = require('../controller/auth');
const router = express.Router();

router.post('/signUp', signUp); //register users
router.post('/login', login); //verifying users

module.exports = router;