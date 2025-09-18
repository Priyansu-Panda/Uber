const express = require('express');
const router = express.Router();
// need to checck and validate the data recived from the frontend;
const {body} = require('express-validator');

const userController = require('../controllers/user.controller')
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/register', [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('fullname.firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
], 
userController.registerUser
)   // if any error happens in the body will be sent to the controller {req.BODY}


// router.post('/register', [
//     body('email').isEmail().withMessage('Invalid email address'),
//     body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
//     body('fullname.firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
// ], async (req, res) => {
//     try {
//         const { email, password, name } = req.body;
//         const user = new userModel({ email, password, name });
//         await user.save();
//         res.status(201).json({ message: 'User registered successfully' });
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// })


router.post('/login', [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
], 
userController.loginUser
)

router.get('/profile',authMiddleware.authUser, userController.getUserProfile)
router.get('/logout', authMiddleware.authUser, userController.logoutUser)

module.exports = router;