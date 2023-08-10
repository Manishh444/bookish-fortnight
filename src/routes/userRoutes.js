const express = require('express');
const { login, allUser, SignUp } = require('../controllers/userController')
const router = express.Router()

router.route('/').get(allUsers).post(registration);
router.route('/login').post(login)