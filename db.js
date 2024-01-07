const mongoose = require('mongoose')
require('dotenv').config()

const url = process.env.MONGODB_URL

mongoose.connect(url).then((db) => {
    console.log(`conection with db successfull with id ${db.connection.id}`)
}).catch((err) => {
    console.log(err)
})