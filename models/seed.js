/////////////////////////////////////
//// Import Dependencies         ////
/////////////////////////////////////
const mongoose = require('../utils/connection')
const Cars = require('./cars')


//// SEED SCRIPT CODE

const db = mongoose.connection

// we're going to build a seed route
db.on('open', (req, res) => {
    // array of starter resources- cars 
    const startCars = [
        {make: 'Tesla', model: 'Model 3', color: 'Grey', forSale: false},
        {make: 'Ford', model: 'Taurus', color: 'Black', forSale: true},
        {make: 'Chevy', model: 'Silverado', color: 'White', forSale: false},
        {make: 'Hyundai', model: 'Elantra', color: 'Green', forSale: true},
        {make: 'BMW', model: 'M3', color: 'Blue', forSale: false}
    ]
    // then we delete every fruit in the database(all instances of this resource)
    Cars.deleteMany({ owner: null})
        .then(() => {
    Cars.create(startCars)
        .then(data => {
            console.log('Here are the created cars:', data)
            db.close()
        })
        .catch(err => console.log('The following error occured: \n', err))
        db.close()
    })
})
.catch(err => {
    console.log(err)
    // always make sure to close the connection
    db.close()
})