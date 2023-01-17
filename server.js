//// IMPORT DEPENDENCIES

const exp = require('constants')
const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
require('dotenv').config()
const path = require('path')


//// IMPORT MODELS



//// CONNECT TO DATABASE

const DATABASE_URL = process.env.DATABASE_URL
const CONFIG = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
// Establish connection
mongoose.connect(DATABASE_URL, CONFIG)

// Tell mongoose what to do with certain events
    .on('open', () => console.log('Connected to mongoose'))
    .on('close', () => console.log('Disconnected from mongoose'))
    .on('error', () => console.log('An error occured: \n', err))


// CREATE EXPRESS APP OBJECT
const app = express()

//// ADD MIDDLEWARE
app.use(morgan('tiny'))
app.use(express.urlencoded({ extended: true}))
app.use(express.static('public')) 
app.use(express.json()) 

// ROUTES
app.get('/', (req, res) => {
    res.send('Server is live, ready for requests')
})


