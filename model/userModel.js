const mongoose = require('mongoose')
const { isEmailValid } = require('../utility/validation')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email already exists"],
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    }
})

const userModel = mongoose.model('User', userSchema)
module.exports = userModel