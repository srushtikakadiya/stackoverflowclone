const fs = require('fs');

module.exports = async function (req, res, next) {
    try {
        if (!req.files || Object.keys(req.files).length === 0)
            return res.status(400).json({ msg: "No files were uploaded." })

        const file = req.files.file;

        if (file.size > 1024 * 1024) {
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
}

const removeTmp = (path) => {
    fs.unlink(path, err => {
        if (err) throw err
    })
}