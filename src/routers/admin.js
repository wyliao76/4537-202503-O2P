const express = require('express')
const router = new express.Router()
const adminController = require('../controllers/admin')

router.get('/', adminController.isAdminGET)

router.get('/users', adminController.usersGET)

router.post('/banUser', adminController.banUserPOST)

router.post('/unBanUser', adminController.unBanUserPOST)

router.post('/adjustToken', adminController.adjustTokenPOST)

router.get('/records', adminController.recordsGET)

module.exports = router
