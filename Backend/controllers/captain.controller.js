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
                errors: errors.array()
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
