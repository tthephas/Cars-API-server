//// Import Dependencies         
/////////////////////////////////////
const express = require('express')
const Cars = require('../models/cars')


//// Create Router 
/////////////////////////////////////
const router = express.Router()


//// Routes 
//////////////////////////////

// POST ROUTE 
// only logged in users can comment
// route is  /comments/carid
router.post('/:carId', (req, res) => {
    const carId = req.params.carId
    
    console.log('this is the session\n', req.session)
    if (req.session.loggedIn) {
        req.body.author = req.session.userId
        const theComment = req.body
        
        Cars.findById(carId)
            .then(car => {
                car.comments.push(theComment)
                return car.save()
            })

            .then(car => {
                res.status(201).json({ car: car })
            })

            .catch(err => {
                console.log(err)
                res.status(400).json(err)
            })
    } else {
        res.sendStatus(401)
    }
})

// DELETE -> `/comments/delete/<someFruitId>/<someCommentId>`
// make sure only the author of the comment can delete the comment
router.delete('/delete/:carId/:commId', (req, res) => {

    const { carId, commId } = req.params

    Cars.findById(carId)
        .then(car => {
             const theComment = car.comments.id(commId)
            console.log('this is the comment to be deleted: \n', theComment)

            if (req.session.loggedIn) {

                if (theComment.author == req.session.userId) {
  
                    theComment.remove()
                    car.save()
                    res.sendStatus(204) 
                } else {

                    res.sendStatus(401)
                }
            } else {

                res.sendStatus(401)
            }
        })
        .catch(err => {
            console.log(err)
            res.status(400).json(err)
        })
})


//////////////////////////////
//// Export Router        ////
//////////////////////////////
module.exports = router