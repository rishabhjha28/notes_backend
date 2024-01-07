const express = require('express')
const router = express.Router()
require("../db")
const notesModel = require('../model/notesModel')
const checkAuth = require('../middleware/checkAuth')
const { isEmailValid } = require('../utility/validation')
const userModel = require('../model/userModel')

router.get('/', checkAuth ,async (req, res) => {
    const user = req.id
    notesModel.find({user})
    .then((data) => {
        res.status(200).json({notes: data})
    })
    .catch((err) => {
        res.status(500).json({error: err.message})
    })
})

router.get('/:id', checkAuth ,async (req, res) => {
    const id = req.params.id
    const userId = req.id
    notesModel.findOne({_id:id, user: userId})
    .then((data) => {
        res.status(200).json({note: data})
    })
    .catch((err) => {
        res.status(500).json({error: err.message})
    })
})

router.post('/', checkAuth ,async (req, res) => {
    const user = req.id
    const {title, body} = req.body
    if(!title || !body){
        return res.status(422).json({error: "Please fill all the fields"})
    }
    try{
        const newNote = new notesModel({title, body, user})
        newNote.save()
        .then((data) => {
            res.status(201).json({message: "Note created successfully with id " + data._id})
        })
        .catch((err) => {
            res.status(500).json({error: err.message})
        })
    }
    catch(err){
        res.status(500).json({error: err.message})
    }
})

router.put('/:id', checkAuth ,async (req, res) => {
    const id = req.params.id
    const userId = req.id
    const {title, body} = req.body
    const thingsToUpdate = {}
    if(title && body){
        if(title.length < 3){
            return res.status(422).json({error: "Title should be atleast 3 characters"})
        }
        if(body.length < 10){
            return res.status(422).json({error: "Body should be atleast 10 characters"})
        }
        thingsToUpdate.title = title
        thingsToUpdate.body = body
    }
    else if(title){
        if(title.length < 3){
            return res.status(422).json({error: "Title should be atleast 3 characters"})
        }
        thingsToUpdate.title = title
    }
    else if(body){
        if(body.length < 10){
            return res.status(422).json({error: "Body should be atleast 10 characters"})
        }
        thingsToUpdate.body = body
    }
    else{
        return res.status(422).json({error: "Please fill any one field"})
    }
    notesModel.findOneAndUpdate({_id:id, user: userId}, {$set: thingsToUpdate})
    .then((data) => {
        if(!data){
            return res.status(404).json({error: "Note not found"})
        }
        res.status(200).json({message: "Note updated successfully"})
    })
    .catch((err) => {
        res.status(500).json({error: err.message})
    })
})

router.delete('/:id', checkAuth ,async (req, res) => {
    const id = req.params.id
    const userId = req.id
    notesModel.findOneAndDelete({_id:id, user: userId})
    .then((data) => {
        if(!data){
            return res.status(404).json({error: "Note not found"})
        }
        res.status(200).json({message: "Note deleted successfully"})
    })
    .catch((err) => {
        res.status(500).json({error: err.message})
    })
})

router.post('/:id/share', checkAuth ,async (req, res) => {
    const id = req.params.id
    const userId = req.id
    const {email} = req.body
    if(!email){
        return res.status(422).json({error: "Please fill email fields"})
    }
    if(!isEmailValid(email)){
        return res.status(422).json({error: "Invalid Email"})
    }
    userModel.findOne({email})
    .then((shareUser) => {
        if(!shareUser){
            return res.status(404).json({error: "share user not found.Enter valid email"})
        }
        notesModel.findOne({_id:id, user: userId})
        .then((data) => {
            if(!data){
                return res.status(404).json({error: "Note not found"})
            }
            if(data.user.toString() === shareUser._id.toString()){
                return res.status(422).json({error: "You can't share note to yourself"})
            }
            if(data.sharedWith.includes(shareUser._id)){
                return res.status(422).json({error: "Note already shared with this user"})
            }
            data.sharedWith.push(shareUser._id)
            data.save()
            .then((data) => {
                res.status(200).json({message: "Note shared successfully"})
            })
            .catch((err) => {
                res.status(500).json({error: err.message})
            })
        })
        .catch((err) => {
            res.status(500).json({error: err.message})
        })  
    })
    .catch((err) => {
        res.status(500).json({error: err.message})
    })
})

module.exports = router