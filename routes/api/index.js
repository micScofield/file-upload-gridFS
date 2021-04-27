const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
    // res.status(200).json({msg: 'Hello World'})

    //To render using EJS:-
    res.render('index')
})

module.exports = router