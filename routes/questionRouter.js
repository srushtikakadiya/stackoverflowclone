const router = require('express').Router()
const questionCtrl = require('../controllers/questionCtrl')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')

router.post('/uploadimage',auth, questionCtrl.uploadImage)

router.post('/create',auth, questionCtrl.createQuestion)

router.get('/', questionCtrl.getQuestions)

router.get('/:id', questionCtrl.getQuestion)

router.post('/vote/:id',auth, questionCtrl.setLikes)

router.delete('/:id',auth, questionCtrl.deleteQuestion)

router.post('/get/:id',auth, questionCtrl.getQuestionForEditing)

router.patch('/:id',auth, questionCtrl.upadteQuestion)

router.patch('/setansweared/:id',auth, questionCtrl.setAnswearedQuestion)


module.exports = router