const router = require('express').Router()
const answearCtrl = require('../controllers/answearCtrl')

const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')

router.post('/uploadimage',auth, answearCtrl.uploadImage)

router.post('/create',auth, answearCtrl.createAnswear)

router.get('/fromquestion/:id', answearCtrl.getAnswears)

router.post('/vote/:id',auth, answearCtrl.setLike)

router.delete('/:id',auth, answearCtrl.deleteAnswear)

router.post('/get/:id',auth, answearCtrl.getAnswearForEditing)

router.patch('/:id',auth, answearCtrl.updateAnswear)

module.exports = router