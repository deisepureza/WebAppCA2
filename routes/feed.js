//setting express router 
const express = require('express');
// importing from express validator package
const { body } = require('express-validator/check');
//const { body } = require('express-validator');

//importng feed controllers
const feedController = require('../controllers/feed');
const isAuth = require('../middleware/is-auth');

//creating router function
const router = express.Router();

//defining routes

//GET /feed/posts
router.get('/posts', isAuth, feedController.getPosts);

//POST //feed/post
router.post('/post', isAuth,
 [
    body('title')
        .trim()
        .isLength({min: 5}),
    body('content').trim().isLength({min: 5})
 ],
 feedController.createPost);

 //GET router to 
 router.get('/post/:postId', isAuth, feedController.getPost);
//router for edit method
 router.put('/post/:postId', isAuth, [
     body('title')
     .trim()
     .isLength({ min: 5}),
     body('content')
     .trim()
     .isLength({ min: 5})
 ],
 feedController.updatePost
 );

 //delete router
 router.delete('/post/:postId', isAuth, feedController.deletePost);

//exporting the router 
module.exports = router;