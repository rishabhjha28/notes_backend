const express = require('express')
const router = express.Router()
require("../db")
const notesModel = require('../model/notesModel')
const checkAuth = require('../middleware/checkAuth')

router.get('/', checkAuth, async (req, res) => {
    const user = req.id
    const query = req.query.q
    notesModel.find({user, $text: {$search: query}})
    .then((data) => {
        res.status(200).json({notes: data})
    })
    .catch((err) => {
        res.status(500).json({error: err.message})
    })
})

module.exports = router