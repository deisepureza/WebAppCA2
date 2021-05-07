//importing path packgaes 
const path = require('path');

//importing express
const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const multer = require('multer');

//importing   routes
const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');
//const { Result } = require('express-validator');

//executing express as function to create my app express
const app = express();

//file storage control
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'img');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '-' + file.originalname);
    }
});

//image file filer
const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'img/png' ||
        file.mimetype === 'img/jpg' ||
        file.mimetype === 'img/jpeg'
    ) { 
        cb(null, true); 
    } else {
        cb(null, false);
    }
};
//initializing bodyparser calling by enconded
//app.use(bodyParser.urlencoded()); //x-www-form-urlencoded <form>
//middleware to parse incoming json data
//app.use(bodyParser.json()); //aplication/json
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'));

app.use('/img', express.static(path.join(__dirname, 'img')));

app.use((req, res, next) => {
    res.setHeader('Acess-Control-Allow-Origin', '*');
    res.setHeader('Acess-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Acess-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})

//foward incoming requests
app.use('/feed',feedRoutes);
app.use('/auth', authRoutes);

//error function
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({message: message, data: data });
});

//db connection
mongoose
.connect('mongodb+srv://deisianepureza:Dp30101989@webappca2.txa5a.mongodb.net/blogmessages?retryWrites=true&w=majority'
)
.then(result => {
    app.listen(8080);
})
.catch(err => console.logo(err));