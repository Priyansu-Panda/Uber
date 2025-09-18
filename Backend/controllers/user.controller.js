// Logic of routes will be here


const userModel = require('../models/user.model');
const userService = require('../services/user.service')
const blacklistTokenModel = require('../models/blacklistToken.model');

const {validationResult} = require('express-validator')

module.exports.registerUser = async (req, res, next)=>{
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})   // will print the withMessage (of body error) in the routes 
        }

        // const {firstname, lastname, email, password} = req.body;
        const {fullname, email, password} = req.body;
        const isUserAlreadyExist = await userModel.findOne({email});
        if(isUserAlreadyExist){
            return res.status(400).json({
                success: false,
                message: 'User already exist',
            })
        }
        const hashedPassword = await userModel.hashPassword(password);

        const user = await userService.createUser({
            fullname,
            email,
            password: hashedPassword
        });
        
        // with this generated user we will generate a token
        const token = user.generateAuthToken();
        res.status(201).json({token, user});
    } catch (error) {
        if (error.statusCode === 409) {
            return res.status(409).json({ message: error.message });
        }
        console.error("Registration error:", error);
        res.status(500).json({ message: "Registration failed. Please try again." });
    }
};

module.exports.loginUser = async (req,res,next)=>{
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const {email, password} = req.body;
    const user = await userModel.findOne({email}).select('+password');

    if(!user){
        return res.status(401).json({message: 'User dont exist'})
    }

    const isMatch = await user.comparePassword(password);

    if(!isMatch){
        return res.status(401).json({message:'Invalid Password'})
    }

    const token = user.generateAuthToken();
    res.cookie('token', token);

    res.status(200).json({token, user});
}

module.exports.getUserProfile = async (req,res,next)=>{
    res.status(200).json({user: req.user});
}

module.exports.logoutUser = async (req,res,next)=>{
    res.clearCookie('token');
    const token = req.cookies.token;
    // if(!token){
    //     return res.status(401).json({message: 'No token, authorization denied'});
    // }

    //  blacklist the token
    await blacklistTokenModel.create({token});

    res.status(200).json({message: 'User logged out'});
}