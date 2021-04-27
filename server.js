const express = require('express')
const methodOverride = require('method-override')
const config = require('config')
const mongoose = require('mongoose')
const mongoURI = config.get('mongoURI')
const Grid = require('gridfs-stream')
Grid.mongo = mongoose.mongo;

const { upload } = require('./storage/storageEngine')

const app = express()

//For bodyparsing
app.use(express.json())

//To understand we will use query string to create our form for a delete request
app.use(methodOverride('_method'))

//Follow this exact syntax to setup EJS
app.set('view engine', 'ejs')

//Public Folder
app.use(express.static('./public'))

//MongoDB Connection
const conn = mongoose.createConnection(
    mongoURI,
    { useNewUrlParser: true },
    console.log('DB connected')
)

//Routes
// app.use('/', require('./routes/api/index'))
// app.use('/files', require('./routes/api/fileUpload'))

//Initialize gridfs stream
let gfs
conn.once('open', () => {
    gfs = Grid(conn.db);
    gfs.collection('uploads')

    //Homepage
    app.get('/', (req, res) => {
        gfs.files.find().toArray((err, files) => {
            if (!files || files.length === 0) {
                res.render('index', { files: false })
            } else {
                //display images only, so filtering files
                files.map(file => {
                    if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
                        file.isImage = true
                    } else {
                        file.isImage = false
                    }
                })
                res.render('index', { files: files })
            }
        })
    })

    //Upload a file
    app.post('/files', upload.single('file'), (req, res) => {
        // res.json({file: req.file})
        res.redirect('/')
    })

    //get all files
    app.get('/files', (req, res) => {
        gfs.files.find().toArray((err, files) => {
            if (!files || files.length === 0) {
                return res.status(404).json({ err: 'No files Exist' })
            }

            return res.json(files)
        })
    })

    //get individual files by filename
    app.get('/files/:filename', (req, res) => {
        gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
            if (!file) {
                return res.status(404).json({ err: 'No file Exist' })
            }

            return res.json(file)
        })
    })

    //see actual images stored in the database using readStream
    app.get('/images/:filename', (req, res) => {
        gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
            if (!file) {
                return res.status(404).json({ err: 'No file Exist' })
            }
            //Check if file is an image
            if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
                //read output to browser
                const readStream = gfs.createReadStream(file.filename)
                readStream.pipe(res)
            } else {
                return res.status(401).json({ err: 'File is not an image' })
            }
        })
    })
})


const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))