const mongoose = require('mongoose')

const notesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        minlength: [3, "Title should be minimum 3 characters long"]
    },
    body: {
        type: String,
        required: [true, "Body is required"],
        minlength: [10, "Body should be minimum 10 characters long"]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    sharedWith: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
})
notesSchema.index({body: 'text',title: 'text' })
const notesModel = mongoose.model('Note', notesSchema)
module.exports = notesModel