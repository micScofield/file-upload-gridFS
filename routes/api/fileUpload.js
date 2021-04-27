const express = require('express')

const { upload } = require('../../storage/storageEngine')

const router = express.Router()

//upload files  @access=public
router.post('/', upload.single('file'), (req, res) => {
    // res.json({file: req.file})
    res.redirect('/')
})

// get all files  @access=public
router.get('/', (req, res) => {
    gfs.files.find().toArray((err, files) => {
        if(!files || files.length === 0) {
            res.status(404).json({err: 'No files Exist'})
        }

        return res.json(files)
    })
})

module.exports = router

/*
_________________________________________________NOTES____________________________________________________

* upload.single allows to upload only a single file and pass inside the "name" field of the file input defined in the ejs

* router.post('/', upload.single('file'), (req, res) => {
    res.json({file: req.file})
})
after executing gives us uploads.chunks and uploads.files inside the collection(gridFS) defined in the URI


*/