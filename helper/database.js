//importing database
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

//variable to be internally use in db file
let _db;

//method to excute mongoclient function
const mongoConnect = callback => {
    //using mongoclient to connect to a db
    MongoClient.connect('mongodb+srv://deisianepureza:Dp30101989@webappca2.txa5a.mongodb.net/ca2bookshop?retryWrites=true&w=majority')
    .then(client => {
    console.log('Connected!');
    //storing the connection to the db
    _db = client.db();
    callback();
    })
    .catch(err => {
    console.log(err);
    throw err;
    });
};

//this method will return the access to the db connected
const getDb = () => {
    if (_db) {
        return _db;
    }
    throw 'No DB found!';
};

//exporting methods for connection/storing db
exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
