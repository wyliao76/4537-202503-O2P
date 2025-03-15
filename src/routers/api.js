const express = require('express')
const router = new express.Router()
const apiController = require('../controllers/api')

router.post('/questions', apiController.questionsPOST)

router.post('/persona', apiController.personaPOST)

router.post('/image', apiController.imagePOST)

module.exports = router
