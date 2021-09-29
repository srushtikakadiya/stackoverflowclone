const Users = require('../models/userModel')
const Question = require('../models/questionModel')
const Comment = require('../models/commentModel')
const Notification = require('../models/notificationModel')


const notificationCtrl = {
    createNotification: async (req, res) => {
        try {
            if (req?.body?.type == "Report" && req?.body?.on == "Question") {
                const notification = new Notification({
                    to: "Admins",
                    type: "Report",
                    onWhatNotification: req?.body?.on,
                    onWhatId: req?.body?.questionId,
                    description: req?.body?.text,
                })
                notification.save()
                res.json({ notification: true })
            }

        } catch (err) {
            console.log(err)
        }
    },
    getNotifications: async (req, res) => {
        try {
            let user = await Users.find({ "_id": req.user.id })
            if (user[0]?.role) {
                let nots = await Notification.find({ wasseen: false })
                res.json({ notifications: nots })
            }
        } catch (err) {
            console.log(err)
        }
    },
    deleteNotification: async (req, res) => {
        try {
            let notification = await Notification.find({ "_id": req.params.id })
            if (notification.length) {
                notification[0].remove()
                return res.json({ reload: true })
            }
            res.json({ reload: false })
        } catch (err) {
            console.log(err)
        }
    }
}

module.exports = notificationCtrl
