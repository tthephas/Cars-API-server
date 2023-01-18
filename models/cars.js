//// BUILD A SCHEMA FOR THE CARS RESOURCE

const { default: mongoose } = require('../utils/connection')

// pull schema and model from mongoose
const { Schema, model } = mongoose

// make the cars schema
const carsSchema = new Schema({
    make: String,
    model: String,
    color: String, 
    forSale: Boolean
})

// make the cars model
// two args, what we are calling our model and schema used to build our model
const Cars = model("Cars", carsSchema)

// Export the model
module.exports = Cars

