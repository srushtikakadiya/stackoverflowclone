const Users = require('../models/userModel')
const Question = require('../models/questionModel')
const Answear = require('../models/answearModel')


const mongoose = require('mongoose')

const fs = require('fs');

const fetch = require('node-fetch')


const questionCtrl = {
    uploadImage: async (req, res) => {
        try {
            if (!req.files || Object.keys(req.files).length === 0)
                return res.status(400).json({ msg: "No files were uploaded." })

            const file = req.files.file;

            if (file.size > 1024 * 1024) {
                removeTmp(file.tempFilePath)
                return res.status(400).json({ msg: "Size too large." })
            } // 1mb

            if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg') {
                removeTmp(file.tempFilePath)
                return res.status(400).json({ msg: "File format is incorrect." })
            }
            let new_image_name = `uploads/questions/${Date.now()}_${file.name}`
            fs.rename(file.tempFilePath, new_image_name, (err,) => {

                if (err) {
                    return res.status(500).json({ msg: err })
                }
                return res.json({ url: new_image_name })
            });
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    createQuestion: async (req, res) => {
        try {
            if (req.body.title && req.body.description) {
                const newQuestion = new Question({
                    title: req.body.title,
                    description: req.body.description,
                    tags: req.body.tags,
                    images: req.body.photos,
                    writer: mongoose.Types.ObjectId(req.user.id)
                })

                newQuestion.save()
                console.log(newQuestion)
                return res.json({ reload: true })
            }
            return res.json({ reload: false })

        } catch (err) {
            console.log(err)
        }
    },
    getQuestions: async (req, res) => {
        try {
            let search_args = {}
            if (req.query.search)
                search_args.$or = [{ title: { "$regex": req.query.search, "$options": "i" } }, { description: { "$regex": req.query.search, "$options": "i" } }]
            if (req.query.isansweared === 'true')
                search_args.answered = true
            if (req.query.tag) {
                var regexp = new RegExp(req.query.tag, "i");
                search_args.tags = { $in: [regexp] }
            }
            let questions = await Question
                .find(search_args)
                .sort({ "createdAt": -1 })
                .skip(parseInt(req.query.page) * parseInt(req.query.limit))
                .limit(parseInt(req.query.limit))
                .populate("writer")

            let lengthOfTheQuestions = await Question
                .find(search_args)
                .countDocuments();

            res.json({ questions, lengthOfTheQuestions })

        } catch (err) {
            console.log(err)
        }
    },
    getQuestion: async (req, res) => {
        try {
            let q = await Question.find({ '_id': req.params.id })
                ?.populate('writer')
            if (q.length) {
                res.json({ question: q })
            }
            else {
                res.json({ redirect: true })
            }
        } catch (err) {
            console.log(err)
        }
    },
    getQuestionForEditing: async (req, res) => {
        try {
            let user = await Users.find({ "_id": req.user.id })
            let question = await Question.find({ "_id": req.params.id }).populate("writer")
            if (!question.length)
                return res.json({ redirect: true })
            if (user[0].role || user[0]._id.toString() == question[0].writer._id)
                return res.json({ question: question[0], redirect: false })
            else
                return res.json({ redirect: true })
        } catch (err) {
            console.log(err)
        }
    },
    setLikes: async (req, res) => {
        try {
            Question.find({ '_id': mongoose.Types.ObjectId(req.params.id) }).then(q => {
                if (!q.length) {
                    return res.json({ pososi: "x2" })
                }
                else {
                    if (q[0].likes.indexOf(req.user.id) == -1)
                        q[0].likes.push(req.user.id)
                    else
                        q[0].likes.splice(q[0].likes.indexOf(req.user.id), 1)
                    q[0].save()
                    return res.json({ reload: true })
                }
            })
        } catch (err) {
            console.log(err)
            return res.json({ reload: true, err: err })

        }
    },
    deleteQuestion: async (req, res) => {
        try {
            let user = await Users.find({ "_id": req.user.id })
            let question = await Question.find({ "_id": req.params.id })
            if (user[0].role || user[0]._id.toString() == question[0].writer.toString()) {
                question[0].remove()
                let answears = await Answear.find({ "question": req.params.id })
                if (answears.length) {
                    answears.forEach(a => {
                        a.remove()
                    });
                }
                let comments = await Answear.find({ "question": req.params.id })
                if (comments.length) {
                    comments.forEach(a => {
                        a.remove()
                    });
                }
                res.json({ removed: true })
            }
            else {
                res.json({ error: true })
            }

        } catch (err) {
            console.log(err)
        }
    },
    upadteQuestion: async (req, res) => {
        try {
            let user = await Users.find({ "_id": req.user.id })
            let question = await Question.find({ "_id": req.params.id }).populate("writer")
            console.log(user, question, req.body)
            if (!question.length && !req?.body?.questiontitle?.length && !req?.body?.questiontext.length)
                return res.json({ reload: false })
            if (user[0].role || user[0]._id.toString() == question[0].writer._id.toString()) {
                question[0].tags = req.body.tags
                question[0].images = req.body.photos
                question[0].title = req.body.questiontitle
                question[0].description = req.body.questiontext
                question[0].save()
                return res.json({ reload: true })
            }
            else
                return res.json({ reload: false })
        } catch (err) {
            console.log(err)
        }
    },
    setAnswearedQuestion: async (req, res) => {
        try {
            let user = await Users.find({ "_id": req.user.id })
            let question = await Question.find({ "_id": req.params.id }).populate("writer")
            if (!question.length)
                return res.json({ error: true })
            if (user[0].role || user[0]._id === question[0].writer) {
                question[0].answered = !question[0].answered
                question[0].save()
                return res.json({ error: false, reload: true })
            }
            else
                return res.json({ error: true })
        } catch (err) {
            console.log(err)
        }
    }

}

module.exports = questionCtrl