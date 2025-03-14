const express = require('express')
const router = new express.Router()
const adminController = require('../controllers/admin')

router.get('/users', adminController.usersGET)

module.exports = router
