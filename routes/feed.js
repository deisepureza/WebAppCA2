//setting express router 
const express = require('express');
// importing from express validator package
const { body } = require('express-validator/check');

//importng feed controllers
const feedController = require('../controllers/feed');

//creating router function
const router = express.Router();

//defining routes

//GET /feed/posts
router.get('/posts', feedController.getPosts);

//POST //feed/post
router.post('/post',
 [
    body('title')
        .trim()
        .isLength({min: 5}),
    body('content').trim().isLength({min: 5})
 ],
 feedController.createPost);

//exporting the router 
module.exports = router;