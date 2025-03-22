const express = require('express')
const router = new express.Router()
const apiController = require('../controllers/api')

router.get('/questions', apiController.questionsGET)

router.post('/persona', apiController.personaPOST)

router.get('/quizzes', apiController.quizzesGET)

router.get('/tokens', apiController.tokensGET)

module.exports = router
