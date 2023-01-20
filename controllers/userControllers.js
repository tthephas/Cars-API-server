
//// Import Dependencies
/////////////////////////////////////

const express = require('express')
const User = require('../models/user')
const bcrypt = require('bcryptjs')


//// Create Router 
/////////////////////////////////////
const router = express.Router()


//// Routes  
//////////////////////////////


// GET -> /users/signup
// This renders a liquid page with the signup form
router.get('/signup', (req, res) => {
    res.render('users/signup')
})


// POST -> /users/signup
// This route creates new users in our db
router.post('/signup', async (req, res) => {
    // this route will take a req.body and use that data to create a user
    const newUser = req.body

    // we'll need to encrypt their password
    // this is where bcrypt comes into play
    // for the sake of bcrypt, we're going to use async and await
    newUser.password = await bcrypt.hash(
        newUser.password,
        await bcrypt.genSalt(10)
    )
    // then create the user
    User.create(newUser)
        // if we're successful, send a 201 status
        .then(user => {
            // console.log('new user created \n', user)
            res.status(201).json({ username: user.username })
        })
        // if there is an error, handle the error
        .catch(err => {
            console.log(err)
            res.json(err)
        })
})

// GET -> /users/login
// This renders a liquid page with the login form
router.get('/login', (req, res) => {
    res.render('users/login')
})



// POST -> /users/login
// This route creates new session in our db(and in the browser)
router.post('/login', async (req, res) => {
    // first we want to destructure the username and password from our req.body
    const { username, password } = req.body

    // search the db, for a user with a specific username
    User.findOne({ username })
        .then(async (user) => {
            // we check if that user exists
            if (user) {
                // if they do, we compare the passwords using bcrypt
                // bcrypt.compare -> evaluates to a truthy or a falsy value
                // we'll save that result to a variable for easy reference later
                // password -> comes from req.body
                // user.password -> is saved in the database
                const result = await bcrypt.compare(password, user.password)

                if (result) {
                    // if the passwords match, place the user's info in the session
                    // this is where we use that session object that lives in our request object

                    console.log('this is req.session \n', req.session)

                    req.session.username = username
                    req.session.loggedIn = true
                    req.session.userId = user.id

                    

                    // we'll send a 201 response and the user as json(for now)
                    // we'll update this after a couple tests to adhere to best practices
                    //res.redirect('/')
                    res.status(201).json({ user: user.toObject() })
                } else {
                    // if the passwords dont match, send the user a message
                    res.redirect(`/error?error=username%20or password%20is%20incorrect`)
                }

            } else {
                // if the user does not exist, we respond with a message saying so
                res.redirect(`/error?error=user%20does%20 not%20exist%20`)
            }

        })
        .catch(err => {
            console.log(err)
            res.redirect(`/error?error=${err}`)
        })
})

// GET -> /users/logout
// This route renders a page that allows user to logout
router.get('/logout', (req, res) => {
    res.render('users/logout')
})

// DELETE -> /users/logout
// This route destroys a session in our db(and in the browser)
router.delete('/logout', (req, res) => {
    // destroy the session and send an appropriate response
    req.session.destroy(() => {
        console.log('this is req.session upon logout \n', req.session)
        // eventually we will redirect users here, but thats after adding the view layer
        res.sendStatus(204)
    })
})



//// Export Router        
//////////////////////////////
module.exports = router