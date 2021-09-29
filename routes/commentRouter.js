const router = require('express').Router()
const commentCtrl = require('../controllers/commentCtrl')

const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')

router.post('/:id',auth, commentCtrl.createComment)

router.get('/:id', commentCtrl.getComments)

router.delete('/:id',auth, commentCtrl.deleteComment)


module.exports = router
