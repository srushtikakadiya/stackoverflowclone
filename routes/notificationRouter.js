const router = require('express').Router()
const notificationCtrl = require('../controllers/notificationCtrl')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')

router.post('/',auth, notificationCtrl.createNotification)

router.post('/get/',auth, notificationCtrl.getNotifications)

router.delete('/:id', auth, authAdmin, notificationCtrl.deleteNotification)




module.exports = router