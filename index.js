import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

//const express = require('express'); this is also correct but newest version node also support import.
const app = express()

import postroutes from './routes/post.js'
import userRoutes from './routes/user.js'

app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cors())

app.use('/post', postroutes)

app.get('/', (req, res) => {
  res.send('Hello to Memories API')
})

app.use('/user', userRoutes)


const PORT = process.env.PORT || 5000

mongoose
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    () => app.listen(PORT, () => console.log(`server running on port:${PORT}`)),
    console.log('Connection done !'),
  )
  .catch((error) => console.log(error.message))
