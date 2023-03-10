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
        //res.status(404).json(err)
        res.redirect(`/error?error=${err}`)
    })
})

// GET for the new page
// form for user to create a new car
router.get('/new', (req, res) => {
    res.render('cars/new', { ...req.session })
})

// CREATE ROUTE
// CREATE - receives a request body, then creates a new document in the database with that data
router.post("/", (req, res) => {
    //console.log("here is session user id", req.session.userId)
    req.body.owner = req.session.userId

    // checkbox magic for the for sale checkbox yes or no
    req.body.forSale = req.body.forSale === 'on' ? true : false
    const newCar = req.body
    //console.log(newCar)
    console.log('this is the req.body or newCar, after owner', newCar)
    Cars.create(newCar)
        .then(car => {
            //res.status(201).json({ car: car.toObject()})
            res.redirect(`/cars/${car.id}`)
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
            //res.status(400).json(err)
            res.redirect(`/error?error=${err}`)
        })
})


// GET route
// Index -> This is a user specific index route
// this will only show the logged in user's cars
router.get('/json', (req, res) => {
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
            //res.status(400).json(err)
            res.redirect(`/error?error=${err}`)
        })
})

// GET request -> edit route
// shows the form for updating a car
router.get('/edit/:id', (req, res) => {
    // because we're editing a specific car, we want to be able to access the car's initial values. so we can use that info on the page.
    const carId = req.params.id
    Cars.findById(carId)
        .then(car => {
            res.render('cars/edit', { car, ...req.session })
        })
        .catch(err => {
            res.redirect(`/error?error=${err}`)
        })
})


//PUT ROUTES
// update a specific car
router.put('/:id', (req, res) => {
    const id = req.params.id
    req.body.forSale = req.body.forSale === 'on' ? true : false
    const updatedCar = req.body
    Cars.findById(id)
        .then(car => {
            if (car.owner == req.session.userId) {
                // send success message
                //res.sendStatus(204)
               
                return car.updateOne(req.body)
            } else {
                
                //res.sendStatus(401)
                res.redirect(`/error?error=You%20Are%20not%20allowed%20to%20edit%20this%20car`)
            }
        })
        .then(() => {
            res.redirect(`/cars/mine`)
        })
        .catch(err => {
            console.log(err)
            //res.status(400).json(err)
            res.redirect(`/error?error=${err}`)
        })
})


//DELETE ROUTE
// delete one car by id
router.delete('/:id', (req, res) => {
    const id = req.params.id
    Cars.findById(id)
        .then(car => {
              if (car.owner == req.session.userId) {
                //res.sendStatus(204)

                return car.deleteOne()
            } else {

                //res.sendStatus(401)
                res.redirect(`/error?error=You%20Are%20not%20allowed%20to%20delete%20this%20car`)
            }
        })
        .then(() => {
            res.redirect('/cars/mine')
        })
        .catch(err => {
            console.log(err)
            //res.status(400).json(err)
            res.redirect(`/error?error=${err}`)
        })
})

// SHOW ROUTE
// read,   find and display one resource
router.get('/:id', (req, res) => {
    const id = req.params.id
    Cars.findById(id)
        .populate('comments.author', 'username')
        .then(car => {
            //res.json({ car : car })
            res.render('cars/show.liquid', {car, ...req.session})
        })

        .catch(err => {
            console.log(err)
            //res.status(404).json(err)
            res.redirect(`/error?error=${err}`)
        })
})


//////////////////////////////
//// Export Router        ////
//////////////////////////////
module.exports = router