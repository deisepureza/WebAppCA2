//setting express router 
const express = require('express');

//importng feed controllers
const feedController = require('../controllers/feed');

//creating router function
const router = express.Router();

//defining routes

//GET /feed/posts
router.get('/posts', feedController.getPosts);

//POST //feed/post
router.post('/post', feedController.createPost);

//exporting the router 
module.exports = router;