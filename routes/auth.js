//importing express
const express = require('express');
const { body } = require('express-validator/check');

const User = require('../models/user');
const authController = require('../controllers/auth');

//router to call express
const router = express.Router();

//
router.put('/signup', [
    body('email')
    .isEmail().withMessage('Please enter a valid address.')
    .custom((value, { req }) => {
        return User.findOne({email: value}).then(userDoc => {
            if (userDoc) {
                return Promise.reject('This e-mail address already exists!')
            }
        });
    })
    .normalizeEmail(),
    body('password').trim().isLength({ min: 5}),
    body('name').trim().not().isEmpty()
], authController.signup
);

//login router
router.post('/login', authController.login);

//exporting  router
module.exports = router;