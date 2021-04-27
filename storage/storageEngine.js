const GridFsStorage = require('multer-gridfs-storage')
const multer = require('multer')
const crypto = require('crypto')
const path = require('path')
const config = require('config')
const mongoURI = config.get('mongoURI')

// Create Storage Engine
const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err)
                }
                const filename = buf.toString('hex') + path.extname(file.originalname)
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads' //should match the collection name
                }
                resolve(fileInfo)
            })
        })
    }
})
const upload = multer({ storage });

module.exports.upload = upload