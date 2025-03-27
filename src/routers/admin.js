const express = require('express')
const router = new express.Router()
const adminController = require('../controllers/admin')

router.get('/', adminController.isAdminGET)

router.get('/users', adminController.usersGET)

router.post('/banUser', adminController.banUserPOST)

router.post('/unBanUser', adminController.unBanUserPOST)

router.patch('/toggleBanUser', adminController.toggleBanUserPATCH)

router.post('/adjustToken', adminController.adjustTokenPOST)

module.exports = router
