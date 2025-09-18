const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const captainSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: [3, 'Name has to be atleast 3 len characters long']
        },
        lastname: {
            type: String,
            minlength: [3, 'Name has to be atleast 3 len characters long']
        }
    },
    email:{
        type: String,
        required: true,
        unique: true,
        // match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        minlength: [5, 'Email has to be atleast 5 len characters long']
    },
    password:{
        type: String,
        required: true, // jwtt will be used
        select: false, // jab user ko find karenfe this field wont be searched 
    },
    socketId:{
        type: String,
    },
    status:{
        type:String,
        enum : ['active', 'inactive'],
        default: 'inactive',
    },
    vehicle:{
        color:{
            type: String,
            required: true,
            minlength: [3, 'Color has to be atleast 3 len characters long']
        },
        plate:{
            type: String,
            required: true,
            minlength: [3, 'Plate has to be atleast 3 len characters long']
        },
        capacity:{
            type: Number,
            required: true,
            minlength: [1, 'Capacity has to be atleast 1 len characters long']
        },
        vehicleType:{
            type: String,
            required: true,
            enum:['car', 'bus', 'truck', 'scooty'],
        } ,
    },
    location:{
        lat: {
            type: Number,
        },
        lng: {
            type: Number,
        }
    }
})

captainSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id: this._id}, process.env.JWT_SECRET || 'your-secret-key', {expiresIn: '24h'});
    return token;
}

captainSchema.methods.comparePassword = async function(password){   
    return await bcrypt.compare(password, this.password);
}

captainSchema.statics.hashPassword = async function(password){
    return await bcrypt.hash(password, 10);
}

const captainModel = mongoose.model('captain', captainSchema)

module.exports = captainModel