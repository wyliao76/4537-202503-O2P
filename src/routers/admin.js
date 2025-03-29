const express = require('express')
const router = new express.Router()
const adminController = require('../controllers/admin')

router.get('/', adminController.isAdminGET)

router.get('/users', adminController.usersGET)

router.patch('/toggleBanUser', adminController.toggleBanUserPATCH)

router.get('/records', adminController.recordsGET)

module.exports = router
