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
        {make: 'Tesla', model: 'Model 3', color: 'Grey', forSale: false}
        {make: 'Ford', model: 'Taurus', color: 'Black', forSale: true}
        {make: 'Chevy', model: 'Silverado', color: 'White', forSale: false}
        {make: 'Hyundai', model: 'Elantra', color: 'Green', forSale: true}
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










// Server listener

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Your port is successfully running smooth: ${PORT}`))


// END