const router = require('express').Router()
const userCtrl = require('../controllers/userCtrl')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')
const usersCtrl = require('../controllers/usersCtrl')


router.post('/', usersCtrl.getAllUsers)

router.get('/:id', usersCtrl.getUser)

router.post('/dashboard', auth, authAdmin, usersCtrl.getAllUsersInfo)

router.post('/admin/user', auth, authAdmin, usersCtrl.getUserInfo)

router.delete('/delete/:id', auth, authAdmin, usersCtrl.deleteUser)

router.post('/settings/info', auth, usersCtrl.updateUserInfo)

router.post('/settings/password', auth, usersCtrl.changePassword)

router.post('/uploadavatar',auth, usersCtrl.uploadImage)

router.patch('/update_role/:id', auth, authAdmin, usersCtrl.updateUsersRole)





module.exports = router