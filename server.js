//// IMPORT DEPENDENCIES

const exp = require('constants')
const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
require('dotenv').config()
const path = require('path')
const Cars = require('./models/cars')


//// IMPORT MODELS



//// CONNECT TO DATABASE

const DATABASE_URL = process.env.DATABASE_URL
const CONFIG = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}




// Establish connection
mongoose.connect(DATABASE_URL, CONFIG)

mongoose.connection

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

// build a seed route
// sends some starter resources to the db
// using the seed script for this
app.get('/cars/seed', (req, res) => {
    //build array of cars
    const startCars = [
        {make: 'Tesla', model: 'Model 3', color: 'Grey', forSale: false},
        {make: 'Ford', model: 'Taurus', color: 'Black', forSale: true},
        {make: 'Chevy', model: 'Silverado', color: 'White', forSale: false},
        {make: 'Hyundai', model: 'Elantra', color: 'Green', forSale: true},
        {make: 'BMW', model: 'M3', color: 'Blue', forSale: false}
    ]
    // then we delete all cars in the db, all instances of the resource
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
app.get('/cars', (req, res) => {
    //find all the cars 
    Cars.find({})
    .then((cars) => {
        res.json({ cars: cars})
    })
    .catch(err => console.log('the following error occurred: \n', err))
})


// CREATE ROUTE
// CREATE - receives a request body, then creates a new document in the database with that data
app.post("/cars", (req, res) => {
    const newCar = req.body
    Cars.create(newCar)
        .then(car => {
            res.status(201).json({ car: car.toObject()})
        })
        .catch((err) => {console.log(err)})
})

//PUT ROUTES
// update a specific car
app.put('/cars/:id', (req, res) => {
    const id = req.params.id
    const updatedCar = req.body
    Cars.findByIdAndUpdate(id, updatedCar, { new: true})
        .then(car => {
            console.log('the newly updated car', car)
            res.sendStatus(204)
        })
        .catch(err => console.log(err))
})

//DELETE ROUTE
// delete one car by id
app.delete('/cars/:id', (req, res) => {
    const id = req.params.id
    Cars.findByIdAndRemove(id)
        .then(() => {
            res.sendStatus(204)
        })
        .catch(err => console.log(err))
})


// SHOW ROUTE
// read,   find and display one resource
app.get('/cars/:id', (req, res) => {
    const id = req.params.id
    Cars.findById(id)
        .then(car => {
            res.json({ car: car})
        })
        .catch(err => console.log(err))
})

// Server listener

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Your port is successfully running smooth: ${PORT}`))


// END