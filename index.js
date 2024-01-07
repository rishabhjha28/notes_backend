require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cors = require('cors')
const cookieParser = require("cookie-parser")
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

const userRouter = require('./router/userRouter')
app.use('/api/auth', userRouter)

const notesRouter = require('./router/notesRouter')
app.use('/api/notes', notesRouter)

const searchRouter = require('./router/searchRouter')
app.use('/api/search', searchRouter)

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})