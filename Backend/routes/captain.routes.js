const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const captainController = require('../controllers/captain.controller');


router.post('/register',[
    body('fullname.firstname').isLength({min: 3}),
    body('email').isEmail(),
    body('password').isLength({min: 6}),
    body('vehicle.plate').isLength({min: 5}).withMessage('Vehicle plate number must be at least 5 characters long'),
    body('vehicle.color').isLength({min: 3}).withMessage('Vehicle color must be at least 3 characters long'),
    body('vehicle.vehicleType').isIn(['car', 'bus', 'truck', 'scooty']).withMessage('Vehicle type must be one of car, bus, truck, or scooty'),
    body('vehicle.capacity').isInt({min: 1}).withMessage('Vehicle capacity must be a positive integer'),
], 
captainController.registerCaptain);


module.exports = router;
