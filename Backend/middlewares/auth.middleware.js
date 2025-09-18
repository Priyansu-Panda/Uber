const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const blacklistTokenModel = require('../models/blacklistToken.model');


module.exports.authUser = async (req,res,next)=>{
    // const token = req.header('Authorization')?.replace('Bearer ', '');
    // console.log(req);
    const token = req.cookies.token || req.header('Authorization')?.replace('bearer ', '');
    // console.log(req.header);
    
    // const token = req.cookies.token || req.header.authorization.split(' ')[1];
    // console.log(req.cookies)
    if(!token){
        return res.status(401).json({message: 'No token, authorization denied'});
    }

    const isBlackListed = await blacklistTokenModel.findOne({token: token});
    // const blacklistToken = await blacklistTokenModel.findOne({token});
    if(isBlackListed){
        return res.status(401).json({message: 'Token is blacklisted'});
    }


    // decoding of token
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decoded);
        // const user = await userModel.findOne({_id: decoded._id});
        const user = await userModel.findById(decoded._id);
        if(!user){
            return res.status(401).json({message: 'User not found'});
        }
        req.user = user;
        return next();
    }catch(err){
        return res.status(401).json({message: 'Token is not valid'});
    }
}