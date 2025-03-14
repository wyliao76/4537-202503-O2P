const express = require('express')
const router = new express.Router()
const authController = require('../controllers/auth')
const { auth } = require('../utilities/index')

router.post('/register', authController.registerPOST)

router.post('/login', authController.loginPOST)

router.get('/logout', auth.isLogin, authController.logoutGET)

router.post('/resetPassword', authController.resetPasswordPOST)

module.exports = router
