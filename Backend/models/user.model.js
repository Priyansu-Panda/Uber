const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const userSchema = new mongoose.Schema({
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
        minlength: [5, 'Email has to be atleast 5 len characters long']
    },
    password:{
        type: String,
        required: true, // jwtt will be used
        select: false, // jab user ko find karenfe this field wont be searched 
    },
    socketId: {
        type: String,
    }
})

userSchema.methods.generateAuthToken = function () {
  // "this" points to the user document
    //   and this will conatin the id of the user
    const token = jwt.sign({ _id: this._id}, process.env.JWT_SECRET || 'your-secret-key', {expiresIn: '24h'});       // If you accidentally use an arrow function instead of function(), this won't point to the document, and this._id will be undefined
    return token;
}

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password);
}
// {
    // Compares plain-text input (password) with hashed password from DB.

    // ⚠️ Watch out: since you set select: false for password, you must explicitly select password when fetching user at login:

    // const user = await User.findOne({ email }).select("+password");
    // if (!user) throw new Error("User not found");

    // const isMatch = await user.comparePassword(inputPassword);
// }

    
userSchema.statics.hashPassword = async function (password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

// {
    // Used when creating a new user:

    // const hashed = await User.hashPassword("plainPassword");
    // const newUser = new User({ email, password: hashed });
    // await newUser.save();
// }




const userModel = mongoose.model('user', userSchema);
module.exports = userModel;

// Now you can use const User = require('./models/user'); anywhere.