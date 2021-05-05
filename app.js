//importing express
const express = require('express');
const bodyparser = require('body-parser');

//importing feed routes
const feedRoutes = require('./routes/feed');
const bodyParser = require('body-parser');

//executing express as function to create my app express
const app = express();

//initializing bodyparser calling by enconded
//app.use(bodyParser.urlencoded()); //x-www-form-urlencoded <form>
//middleware to parse incoming json data
app.use(bodyParser.json()); //aplication/json

app.use((req, res, next) => {
    res.setHeader('Acess-Control-Allow-Origin', '*');
    res.setHeader('Acess-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Acess-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})

//foward incoming requests
app.use('/feed',feedRoutes);

app.listen(8080);