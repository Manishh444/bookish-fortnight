const express = require('express');
const router = express.Router()

router.route('/').get(allUsers).post(registration);
router.route('/login').post(login)