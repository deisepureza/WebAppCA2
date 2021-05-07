const fs = require('fs');
const path = require('path');
//importing validation result from the package
const {validationResult} = require('express-validator/check');
//const {validationResult} = require('express-validator');

//importing post from models
const Post = require('../models/post');
const User = require('../models/user');

//exporting function (will return a json response)
exports.getPosts = (req, res, next) => {
    //getting data from db
    const currentPage = req.query.page || 1;
    const perPage = 2;
    let totalItems;
    Post.find()
    .countDocuments()
    .then(count => {
        totalItems = count;
        return Post.find().skip((currentPage - 1) * perPage).limit(perPage); //adding pagination
    })
    .then(posts => {
        res
            .status(200)
            .json({message: 'post was fetched successfully.', posts: posts, totalItems: totalItems});
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
    });
};

//post router to create blog post
exports.createPost = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Something was incorret, Validation failed.');
        error.statusCode = 422;
        throw error;
    }
    if (!req.file) {
        const error = new Error('No image uploaded');
        error.statusCode = 422;
        throw error;
    }
    const imageUrl = req.file.path;
    const title = req.body.title;
    const content = req.body.content;
    let creator;
    //post model constructor 
    const post = new Post({
        title: title, 
        content: content, 
        imageUrl: imageUrl,
        creator: req.userId, //assign post to the user 
    });
    post
        .save()
        .then(result => {
            return User.findById(req.userId);
        })
        .then(user => {
            creator = user;
            user.posts.push(post);
            return user.save();
        //console.log(result)
        })
        .then(result => {
            //setting status method to 201 (tell the client  the resource was created success) / 200 (sucesso only)
            res.status(201).json({
                message: 'Your Post was created successfully!',
                post: post,
                creator: {_id: creator._id, name: creator.name}
            });
        })
        .catch(err => {
            //setting server side error
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.getPost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
        .then(post => {
            if (!post) {
                const error = new Error('Post not found.');
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({ message: 'Post fetched.', post: post});
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
    });
};

//Updated post fucntion
exports.updatePost = (req, res, next) => {
    const postId = req.params.postId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Something was incorret, Validation failed.');
        error.statusCode = 422;
        throw error;
    }
    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.image;
    if (req.file) {
        imageUrl = req.file.path;
    }
    if (!imageUrl) {
        const error = new Error('No image file picked.');
        error.statusCode = 422;
        throw error;
    }
    //updating in th database
    Post.findById(postId)
    .then(post => {
        if (!post) {
            const error = new Error('Post not found.');
            error.statusCode = 404;
            throw error;
        }
        if (post.creator.toString() !== req.userId) {
            const error = new Error ('Not Authorized!');
            error.statusCode = 403;
            throw error;
        }
        if (imageUrl !== post.imageUrl) {
            clearImage(post.imageUrl);
        }
        post.title = title;
        post.imageUrl = imageUrl;
        post.content = content;
        return post.save();
    })
    .then(result => {
        res.status(200).json({message: 'Post updated successfully!', post: result});
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

//delete action 
exports.deletePost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
        .then(post => {
            if (!post) {
                const error = new Error('Post not found.');
                error.statusCode = 404;
                throw error;
            }
            if (post.creator.toString() !== req.userId) {
                const error = new Error('Not authorized!');
                error.statusCode = 403;
                throw error;
            }
            //check logged in user
            clearImage(post.imageUrl);
            return Post.findByIdAndRemove(postId);
        })
        .then(result => {
            return User.findById(req.userId);
        })
        .then(user => {
            user.posts.pull(postId);
            return user.save();
        })
        .then(result => {
            res.status(200).json({ message: 'Post was deleted successfully!'});
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}
const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err));
};