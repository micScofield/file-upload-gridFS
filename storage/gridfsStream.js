const Grid = require('gridfs-stream')
const config = require('config')
const mongoose = require('mongoose')
const mongoURI = config.get('mongoURI')

//MongoDB Connection
const conn = mongoose.createConnection(
    mongoURI, 
    {useNewUrlParser: true, useUnifiedTopology: true},
    console.log('DB connected')   
)

//Initialize gridfs stream
let gfs
conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads')
})

module.exports = gfs