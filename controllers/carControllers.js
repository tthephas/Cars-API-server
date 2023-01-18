//// Import Dependencies         ////
/////////////////////////////////////
const express = require('express')
const Cars = require('../models/cars')


//// Create Router               ////
/////////////////////////////////////
const router = express.Router()

//// Routes               ////
//////////////////////////////
// we're going to build a seed route
router.get('/seed', (req, res) => {
    // array of starter resources- cars 
    const startCars = [
        {make: 'Tesla', model: 'Model 3', color: 'Grey', forSale: false},
        {make: 'Ford', model: 'Taurus', color: 'Black', forSale: true},
        {make: 'Chevy', model: 'Silverado', color: 'White', forSale: false},
        {make: 'Hyundai', model: 'Elantra', color: 'Green', forSale: true},
        {make: 'BMW', model: 'M3', color: 'Blue', forSale: false}
    ]
    // then we delete every fruit in the database(all instances of this resource)
    Cars.deleteMany({})
        .then(() => {
    Cars.create(startCars)
        .then(data => {
            res.json(data)
        })
        .catch(err => console.log('The following error occured: \n', err))
    })
})


// INDEX ROUTE
// this route will display all fruits 
router.get('/', (req, res) => {
    //find all the cars 
    Cars.find({})
    .then((cars) => {
        res.json({ cars: cars})
    })
    .catch(err => console.log('the following error occurred: \n', err))
})


// CREATE ROUTE
// CREATE - receives a request body, then creates a new document in the database with that data
router.post("/", (req, res) => {
    const newCar = req.body
    Cars.create(newCar)
        .then(car => {
            res.status(201).json({ car: car.toObject()})
        })
        .catch((err) => {console.log(err)})
})


//PUT ROUTES
// update a specific car
router.put('/:id', (req, res) => {
    const id = req.params.id
    const updatedCar = req.body
    Cars.findByIdAndUpdate(id, updatedCar, { new: true })
        .then(car => {
            console.log('the newly updated car', car)
            res.sendStatus(204)
        })
        .catch(err => console.log(err))
})


//DELETE ROUTE
// delete one car by id
router.delete('/:id', (req, res) => {
    const id = req.params.id
    Cars.findByIdAndRemove(id)
        .then(() => {
            res.sendStatus(204)
        })
        .catch(err => console.log(err))
})

// SHOW ROUTE
// read,   find and display one resource
router.get('/:id', (req, res) => {
    const id = req.params.id
    Cars.findById(id)
        .then(car => {
            res.json({ car: car})
        })
        .catch(err => console.log(err))
})


//////////////////////////////
//// Export Router        ////
//////////////////////////////
module.exports = router