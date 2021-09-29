const Users = require('../models/userModel')
const Question = require('../models/questionModel')
const Answear = require('../models/answearModel')

const mongoose = require('mongoose')

const fs = require('fs');

const fetch = require('node-fetch');
const { auth } = require('googleapis/build/src/apis/abusiveexperiencereport');


const answearCtrl = {
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
            let new_image_name = `uploads/answears/${Date.now()}_${file.name}`
            fs.rename(file.tempFilePath, new_image_name, (err,) => {

                if (err) {
                    return res.status(500).json({ msg: err })
                }
                return res.json({ url: "/" + new_image_name })
            });
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    createAnswear: async (req, res) => {
        try {
            console.log(req, req.body)
            if (req.body.answeartext && req.body.questionId) {
                return Question.findById(mongoose.Types.ObjectId(req.body.questionId))
                    .then((q) => {
                        if (q) {
                            const newAnswear = new Answear({
                                images: req.body.photos,
                                description: req.body.answeartext,
                                question: mongoose.Types.ObjectId(req.body.questionId),
                                writer: mongoose.Types.ObjectId(req.user.id)
                            })
                            newAnswear.save()
                            return res.json({ reload: true })
                        }
                        return res.json({ reload: false })

                    })
            }
        } catch (err) {
            console.log(err)
        }
    },
    getAnswears: async (req, res) => {
        try {
            let a = await Answear.find({ 'question': mongoose.Types.ObjectId(req.params.id) })
                ?.sort({ "createdAt": -1 })
                ?.populate('writer')
            if (a.length) {
                console.log(a)
                for (let o = 0; o < a.length; o++) {
                    a[o].writer.password = null
                }
                res.json({ answears: a })
            }
            else {
                res.json({ redirect: true })
            }
        } catch (err) {
            console.log(err)
        }
    },
    setLike: async (req, res) => {
        try {
            console.log(req.user)
            Answear.find({ '_id': mongoose.Types.ObjectId(req.params.id) }).then(q => {
                if (!q.length) {
                    res.json({ reload: false })
                }
                else {
                    if (q[0].likes.indexOf(req.user.id) == -1)
                        q[0].likes.push(req.user.id)
                    else
                        q[0].likes.splice(q[0].likes.indexOf(req.user.id), 1)
                    q[0].save()
                    res.json({ reload: true })
                }
            })
        } catch (err) {
            console.log(err)
        }
    },
    deleteAnswear: async (req, res) => {
        let user = await Users.find({ "_id": req.user.id })
        let answear = await Answear.find({ "_id": req.params.id })
        if (user[0].role) {
            answear[0].remove()
        }
        else if (user[0]._id === answear[0].writer) {
            answear[0].remove()
        }
        else {
            res.json({ error: true })
        }
    },
    getAnswearForEditing: async (req, res) => {
        let user = await Users.find({ "_id": req.user.id })
        let answear = await Answear.find({ "_id": req.params.id }).populate("writer")
        if (!answear.length)
            return res.json({ redirect: true })
        if (user[0].role || user[0]._id == answear[0].writer._id.toString())
            return res.json({ answear: answear[0], redirect: false })
        else
            return res.json({ redirect: true })
    },
    updateAnswear: async (req, res) => {
        let user = await Users.find({ "_id": req.user.id })
        let answear = await Answear.find({ "_id": req.params.id }).populate("writer")

        if (!answear.length && req?.body?.answeartext?.length && req?.body?.photos)
            return res.json({ error: true })
        if (user[0].role || user[0]._id.toString() == answear[0].writer._id.toString()) {
            answear[0].description = req.body.answeartext
            answear[0].images = req.body.photos
            answear[0].save()
            return res.json({ redirect: true })
        }
        else
            return res.json({ error: true })
    }
}

module.exports = answearCtrl