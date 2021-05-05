//exporting function (will return a json response)
exports.getPosts = (req, res, next) => {
    res.status(200).json({
        posts: [{title: 'My First Post', content: 'This is my first post!'}]
    });
};

//post router
exports.createPost = (req, res, next) => {
    const title = req.body.title;
    const content = req.body.content;
    console.log(title, content);
    //create post in db 
    //setting status method to 201 (tell the client  the resource was created success) / 200 (sucesso only)
    res.status(201).json({
        message: 'Your Post was created successfully!',
        post: {id: new Date().toISOString(), title: title, content: content}
    });
};