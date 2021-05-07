//importing path packgaes 
const path = require('path');

//importing express
const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const multer = require('multer');
const helmet = require('helmet');
const morgan = require('morgan');

//importing   routes
const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');
//const { Result } = require('express-validator');

//console.log(process.env.NODE_ENV);

const MONGODB_URI = 
`mongodb+srv://${process.env.MONGO_USER}: ${process.env.MONGO_PASSWORD}@webappca2.txa5a.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`;

//executing express as function to create my app express
const app = express();

//file storage control
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '-' + file.originalname);
    }
});

//image file filer
const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) { 
        cb(null, true); 
    } else {
        cb(null, false);
    }
};
//initializing bodyparser calling by enconded
//app.use(bodyParser.urlencoded()); //x-www-form-urlencoded <form>
//middleware to parse incoming json data
app.use(bodyParser.json()); //aplication/json
app.use(helmet());
app.use(morgan('combined'));
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'));

app.use('/images', express.static(path.join(__dirname, 'images')));

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
.connect(MONGODB_URI)
.then(result => {
    app.listen(process.env.PORT || 8080);
})
.catch(err => {
    console.logo(err);
});

