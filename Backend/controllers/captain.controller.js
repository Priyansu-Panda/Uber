const blacklistTokenModel = require('../models/blacklistToken.model');
const captainModel = require('../models/captain.model');
const captainService = require('../services/captain.service');
const { validationResult } = require('express-validator');


module.exports.registerCaptain = async (req, res, next)=>{
    try{
        // Agr kuch error ata hain in his details 
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                success: false,
                message: errors.array(),
            })
        }

        // Agr kuch error nahi ata hain in his details  then rpoceed further 
        const { fullname, email, password, vehicle } = req.body;

        const hashedPassword = await captainModel.hashPassword(password);

        const isCaptainAlreadyExist = await captainModel.findOne({email});
        if(isCaptainAlreadyExist){
            return res.status(400).json({
                success: false,
                message: 'Captain already exist',
            })
        }

        const captain = await captainService.createCaptain({
            fullname,
            email,
            password: hashedPassword,
            vehicle
        });

        
        // Generate token for the captain
        const token = captain.generateAuthToken();
        
        // Return success response with captain data
        res.status(201).json({
            success: true,
            message: 'Captain registered successfully',
            token,
            captain
        });
    }catch(err){
        next(err);
    }
}

// module.exports.registerCaptain = async (req, res) => {
//     try {
//         const captainData = req.body;
//         const captain = await captainService.createCaptain(captainData);
//         res.status(201).json({
//             success: true,
//             message: 'Captain registered successfully',
//             captain
//         })
//     } catch (error) {
//         res.status(400).json({
//             success: false,
//             message: error.message
//         })
//     }
// }



module.exports.loginCaptain = async (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    const {email, password} = req.body;
    const captain = await captainModel.findOne({email}).select('+password')

    if(!captain){
        return res.status(401).json({message: 'Invalid email or password'});
    }

    const isMatch = await captain.comparePassword(password);

    if(!isMatch){
        return res.status(401).json({message: 'Invalid email or password'})
    }

    const token = captain.generateAuthToken();
    res.cookie('token', token);
    res.status(200).json({token, captain})
}

module.exports.getCaptainProfile = async (req,res,next) => {
    try{
        const captain = req.captain;
        res.status(200).json({captain});
    }catch(err){
        next(err);
    }
}

module.exports.logoutCaptain = async (req,res,next)=>{
    try{
        const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(400).json({message: 'No token provided'});
        }

        await blacklistTokenModel.create({token});

        res.clearCookie('token');
        res.status(200).json({message: 'Logout successful'});
    }catch(err){
        next(err);
    }
}