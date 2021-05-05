//importing validation result from the package
const {validationResult} = require('express-validator/check');

//exporting function (will return a json response)
exports.getPosts = (req, res, next) => {
    res.status(200).json({
        posts: [{title: 'My First Post', 
        content: 'This is my first post!', 
        imageUrl: 'img/LEMONADE.png',
        creator: {
            name:'Deisiane'
        },
        createdAt: new Date() 
        }]
    });
};

//post router
exports.createPost = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422)
            .json({message: 'Something was incorret, Validation failed.',
            errors: errors.array()
        });
    }
    const title = req.body.title;
    const content = req.body.content;
    console.log(title, content);
    //create post in db 
    //setting status method to 201 (tell the client  the resource was created success) / 200 (sucesso only)
    res.status(201).json({
        message: 'Your Post was created successfully!',
        post: {
            _id: new Date().toISOString(), 
            title: title, 
            content: content, 
            creator:{ name: 'Deisiane' },
            createdAt: new Date()
        }
    });
};