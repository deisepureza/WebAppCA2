const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jsonwebt = require('jsonwebtoken');


//importing user model
const User = require('../models/user');

//user actions
exports.signup = (req, res, next) => {
    //logic to create a user in db
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    bcrypt
      .hash(password, 12)
      .then(hashedPw => {
        const user = new User({
          email: email,
          password: hashedPw,
          name: name
        });
        return user.save();
      })//to get db result
        .then(result => {
            res.status(201).json({ message: 'User was created!', userId: result._id})
        })
        .catch(err => {
            if(!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
    })
};

//login action 
exports.login =(req, res, next) => {
    //retrieve login data
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    User
        .findOne({email: email})
        .then(user => {
            if (!user) {
                const error = new Error('Check email address, the user cannot be found.');
                error.statusCode = 401;
                throw error;
            }
            loadedUser = user;
            bcrypt.compare(password, user.password);
    })
    .then(isEqual => {
        if (!isEqual){
        const error = new Error('The passwrod was incorrect, try again!');
        error.statusCode = 401;
        throw error;
    }
        const token = jsonwebt.sign({
            email: loadedUser.email, 
            userId: loadedUser._id.toString()
        }, 'secretwebca2', { expiresIn: '1h'}
        );
        res.status(200).json({token: token, userId: loadedUser._id.toString() });
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};