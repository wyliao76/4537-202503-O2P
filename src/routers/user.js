const express = require('express')
const router = new express.Router()
const userController = require('../controllers/user')

router.get('/', userController.userGET)

module.exports = router
