//// IMPORT DEPENDENCIES

const exp = require('constants')
const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
require('dotenv').config()
const path = require('path')
// refactoring
const CarRouter = require('./controllers/carControllers')
const UserRouter = require('./controllers/userControllers')
const CommentRouter = require('./controllers/commentControllers')
const middleware = require('./utils/middleware')

// create express app object
const app = require('liquid-express-views')(express())



// MIDDLEWARE
middleware(app)

// ROUTES
app.get('/', (req, res) => {
    //res.render('home.liquid')
    const { username, loggedIn, userID } = req.session
    res.render('home.liquid', { username, loggedIn, userId })
})

// register our routes
app.use('/cars', CarRouter)
app.use('/users', UserRouter)
app.use('/comments', CommentRouter)

//render our error page
app.get('/error', (req, res) => {
    const error = req.query.error || "This page does not exist"

    // res.render('error.liquid', { error })
    const { username, loggedIn, userID } = req.session
    res.render('error.liquid', { error, username, loggedIn, userId })
    
})
// this catch all route will redirect user to error page
app.all('*', (req, res) => {
    res.redirect('/error')
})


// Server listener

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Your port is successfully running smooth: ${PORT}`))


// END