const Users = require('../models/userModel')
const Question = require('../models/questionModel')
const Comment = require('../models/commentModel')

const mongoose = require('mongoose')


const commentCtrl = {

    createComment: async (req, res) => {
        try {
            let question = await Question.find({ "_id": req.params.id })

            if (question.length && req.body.commentInput) {
                const newComment = new Comment({
                    description: req.body.commentInput,
                    question: mongoose.Types.ObjectId(req.params.id),
                    writer: mongoose.Types.ObjectId(req.user.id)
                })
                newComment.save()
                return res.json({ reload: true })
            }
            return res.json({ reload: false })

        } catch (err) {
            console.log(err)
        }
    },
    getComments: async (req, res) => {
        try {
            let comments = await Comment.find({ "question": mongoose.Types.ObjectId(req.params.id) })
            return res.json({ comments })
        } catch (err) {
            console.log(err)
        }
    },
    deleteComment: async (req, res) => {
        try {
            let comment = await Comment.find({ "_id": mongoose.Types.ObjectId(req.params.id) })
            let user = await Users.find({ "_id": req.user.id })
            if (user[0].role || user[0]._id.toString() == comment[0].writer._id.toString()) {
                comment[0].remove()
                return res.json({ reload: true })
            }
            return res.json({ reload: false })

        } catch (err) {
            console.log(err)
        }
    }

}

module.exports = commentCtrl