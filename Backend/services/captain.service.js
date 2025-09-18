const captainModel = require('../models/captain.model');

module.exports.createCaptain = async (captainData) => {
    // const captain = await captainModel.create(captainData);
    // return captain;
    const {fullname, email, password, vehicle} = captainData;
    if(!fullname || !email || !password || !vehicle){
        throw new Error('All fields are required');
    }
    // if(!['car', 'bus', 'truck', 'scooty'].includes(vehicle.vehicleType)){
    //     throw new Error('Vehicle type must be one of car, bus, truck, or scooty');
    // }
    const captain = await captainModel.create({
        fullname:{
            firstname: fullname.firstname,
            lastname: fullname.lastname
        },
        email,
        password,
        vehicle: {
            plate: vehicle.plate,
            color: vehicle.color,
            vehicleType: vehicle.vehicleType,
            capacity: vehicle.capacity
        }
    })
    // const captain = await captainModel.create(captainData);
    // await captain.save();
    return captain;
}