
//// Import Dependencies 
/////////////////////////////////////
const express = require('express') // import the express framework
const morgan = require('morgan') // import the morgan request logger
const session = require('express-session') // import the express-session package
const MongoStore = require('connect-mongo') // import the connect-mongo package(for sessions)
require('dotenv').config()


//// Middleware function         ////
/////////////////////////////////////
//  build a function that will take the entire app as an argument, and run requests through all of our middleware
const middleware = (app) => {
    // middleware runs before all the routes.

    app.use(morgan('tiny')) 
    app.use(express.urlencoded({ extended: true })) 
    app.use(express.static('public')) 
    app.use(express.json()) 

    app.use(
        session({
            secret: process.env.SECRET,
            store: MongoStore.create({
                mongoUrl: process.env.DATABASE_URL
            }),
            saveUninitialized: true,
            resave: false
        })
    )
}


//// Export middleware function        ////
///////////////////////////////////////////
module.exports = middleware