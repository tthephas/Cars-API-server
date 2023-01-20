//// Import Dependencies         ////
/////////////////////////////////////
const express = require('express')
const Cars = require('../models/cars')


//// Create Router               ////
/////////////////////////////////////
const router = express.Router()

//// Routes               ////
//////////////////////////////



// INDEX ROUTE
// this route will display all fruits 
router.get('/', (req, res) => {
    const { username, loggedIn, userID } = req.session
    //find all the cars 
    Cars.find({})
    .populate('owner', 'username')
    .populate('comments.author', '-password')
    .then((cars) => {
        
        res.render('cars/index', { cars, username, loggedIn, userID })
    })
    .catch(err => {
        console.log(err)
        res.status(404).json(err)
    })
})


// CREATE ROUTE
// CREATE - receives a request body, then creates a new document in the database with that data
router.post("/", (req, res) => {
    //console.log("here is session user id", req.session.userId)
    req.body.owner = req.session.userId
    const newCar = req.body
    console.log(newCar)
    Cars.create(newCar)
        .then(car => {
            res.status(201).json({ car: car.toObject()})
        })
        .catch(err => {
            console.log(err)
            res.status(404).json(err)
        })
})

// GET route
// Index -> This is a user specific index route
// this will only show the logged in user's cars
router.get('/mine', (req, res) => {
    // find cars by ownership, using the req.session info
    Cars.find({ owner: req.session.userId })
        .populate('owner', 'username')
        .populate('comments.author', '-password')
        .then(cars => {
            // if found, display the cars
            //res.status(200).json({ cars: cars })
            res.render('cars/index', { cars, ...req.session })
        })
        .catch(err => {
            // otherwise throw an error
            console.log(err)
            res.status(400).json(err)
        })
})


//PUT ROUTES
// update a specific car
router.put('/:id', (req, res) => {
    const id = req.params.id
    const updatedCar = req.body
    Cars.findById(id)
        .then(car => {
            if (car.owner == req.session.userId) {
                // send success message
                res.sendStatus(204)
               
                return car.updateOne(req.body)
            } else {
                
                res.sendStatus(401)
            }
        })
        .catch(err => {
            console.log(err)
            res.status(400).json(err)
        })
})


//DELETE ROUTE
// delete one car by id
router.delete('/:id', (req, res) => {
    const id = req.params.id
    Cars.findById(id)
        .then(car => {
              if (car.owner == req.session.userId) {
                res.sendStatus(204)

                return car.deleteOne()
            } else {

                res.sendStatus(401)
            }
        })
        .catch(err => {
            console.log(err)
            res.status(400).json(err)
        })
})

// SHOW ROUTE
// read,   find and display one resource
router.get('/:id', (req, res) => {
    const id = req.params.id
    Cars.findById(id)
        .populate('comments.author', 'username')
        .then(car => {
            res.json({ car : car })
        })

        .catch(err => {
            console.log(err)
            res.status(404).json(err)
        })
})


//////////////////////////////
//// Export Router        ////
//////////////////////////////
module.exports = router