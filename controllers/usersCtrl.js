const Users = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const fs = require('fs');




const usersCtrl = {
    getUser: async (req, res) => {
        try {
            let user = await Users
                .find({ "_id": req.params.id })
                .select('-password')
            res.json({ "user": user[0] })
        } catch (err) {
            console.log(err)
            return res.status(500).json({ msg: err.message })
        }
    },
    getAllUsers: async (req, res) => {
        try {
            let search_args = {}
            if (req.body.searchuser) {
                search_args.name = { "$regex": req.body.searchuser, "$options": "i" }
            }
            if (req.body.isAdmin) {
                search_args.role = 1
            }
            let users = await Users
                .find(search_args)
                .skip(req.body.page * req.body.limit)
                .limit(req.body.limit)
                .select('-password')
            let lengthOfTheUsers = await Users
                .find(search_args)
                .countDocuments();

            res.json({ users, lengthOfTheUsers })
        } catch (err) {
            console.log(err)
            return res.status(500).json({ msg: err.message })
        }
    },
    getAllUsersInfo: async (req, res) => {
        try {
            let search_args = {}
            if (req.body.searchuser) {
                search_args.name = { "$regex": req.body.searchuser, "$options": "i" }
            }
            if (req.body.isAdmin) {
                search_args.role = 1
            }
            let users = await Users
                .find(search_args)
                .skip(req.body.page * req.body.limit)
                .limit(req.body.limit)
                .select('-password')
            let lengthOfTheUsers = await Users
                .find(search_args)
                .countDocuments();

            res.json({ users, lengthOfTheUsers })
        } catch (err) {
            console.log(err)
            return res.status(500).json({ msg: err.message })
        }
    },
    getUserInfo: async (req, res) => {
        try {
            let user = await Users.find({ "_id": req.body.id }).select('-password')
            res.json(user)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    deleteUser: async (req, res) => {
        try {
            await Users.findByIdAndDelete(req.params.id)
            res.json({ msg: "Deleted Success!" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    updateUserInfo: async (req, res) => {
        try {
            Users.findById(req.user.id)
                .then((user) => {
                    user.name = req.body.nickname;
                    user.fullname = req.body.fullname;
                    user.avatar = req.body.avatar;
                    user.tags = req.body.tags;
                    user.save()
                        .then((r) => {
                            console.log(r)
                            return res
                                .status(200)
                                .json({ msg: "Updated" });
                        })
                        .catch((err) => {
                            console.log(err)
                            res.status(400).json({ success: false, msg: `Error` })
                        }
                        );
                })

        } catch (err) {
            console.log(err)

            return res.status(500).json({ msg: err.message })
        }
    },
    changePassword: async (req, res) => {
        try {
            console.log(req)
            const password = req.body.password
            const passwordHash = await bcrypt.hash(password, 12)
            console.log(req.body)
            await Users.findOneAndUpdate({ _id: req.user.id }, {
                password: passwordHash
            })

            res.json({ msg: "Password successfully changed!" })
        } catch (err) {
            console.log(err)
            return res.status(500).json({ msg: err.message })
        }
    },
    uploadImage: async function (req, res, next) {
        try {
            if (!req.files || Object.keys(req.files).length === 0)
                return res.status(400).json({ msg: "No files were uploaded." })

            const file = req.files.file;

            if (file.size > 8 * 1024 * 1024) {
                removeTmp(file.tempFilePath)
                return res.status(400).json({ msg: "Size too large." })
            }
            if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg') {
                removeTmp(file.tempFilePath)
                return res.status(400).json({ msg: "File format is incorrect." })
            }

            let new_image_name = `uploads/avatars/${Date.now()}_${file.name}`
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
    updateUsersRole: async (req, res) => {
        try {
            const { role } = req.body

            await Users.findOneAndUpdate({ _id: req.params.id }, {
                role
            })

            res.json({ msg: "Update Success!" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
}


const removeTmp = (path) => {
    fs.unlink(path, err => {
        if (err) throw err
    })
}


module.exports = usersCtrl