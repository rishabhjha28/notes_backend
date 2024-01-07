const { JWT_SECRET } = process.env
const express = require('express')
const { isEmailValid } = require('../utility/validation')
const router = express.Router()
const bycrypt = require('bcryptjs')
require("../db")
const userModel = require('../model/userModel')
const jwt = require('jsonwebtoken')
router.post('/signup', async (req, res) => {
    const {email, password} = req.body
    if(!email || !password){
        return res.status(422).json({error: "Please fill all the fields"})
    }
    if(password.length < 6){
        return res.status(422).json({error: "Password should be atleast 6 characters"})
    }
    if(!isEmailValid(email)){
        return res.status(422).json({error: "Invalid Email"})
    }
    bycrypt.hash(password, 12)
    .then((hashedPassword) => {
        const newUser = new userModel({email, password:hashedPassword})
        newUser.save()
        .then((data) => {
            const maxAge = 24 * 60 * 60
            const token = jwt.sign({id: data._id}, JWT_SECRET, {expiresIn: maxAge})
            res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000})
            res.status(201).json({message: "User created successfully with id " + data._id})
        })
        .catch((err) => {
            res.status(500).json({error: err.message})
        })
    })
    .catch((err) => {
        res.status(500).json({error: err.message})
    }) 
})


router.post('/login', async (req, res) => { 
    const {email, password} = req.body
    if(!email || !password){
        return res.status(422).json({error: "Please fill all the fields"})
    }
    if(!isEmailValid(email)){
        return res.status(422).json({error: "Invalid Email"})
    }
    userModel.findOne({email})
    .then((data) => {
        if(!data){
            return res.status(404).json({error: "User not found"})
        }
        else{
            bycrypt.compare(password, data.password)
            .then((isMatch) => {
                if(!isMatch){
                    return res.status(401).json({error: "Invalid Email or Password"})
                }
                const maxAge = 24 * 60 * 60
                const token = jwt.sign({id: data._id}, JWT_SECRET, {expiresIn: maxAge})
                res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000})
                res.status(200).json({message: "Login successful"})
            })
            .catch((err) => {
                res.status(500).json({error: err.message})
            })
        }
    })
    .catch((err) => {
        res.status(500).json({error: err.message})
    })
})
module.exports = router