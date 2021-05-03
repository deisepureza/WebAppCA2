const mongodb = require('mongodb');
const getDb = require('../helper/database').getDb;

//using my object id constant to store the reference to the obj class
const ObjectId = mongodb.ObjectId;

class User {
    constructor(username, email) {
        this.name = username;
        this.email = email;
    }

    //save method to save the user to a db
    save() {
        //creating const to call db and store my db client
        const db = getDb();
        db.collection('user').insertOne(this);
    }

    //creating a static method to find user by ID
    static findById(userId) {
        const db = getDb();
        return db.collection('user')
        .findOne({ _id: new ObjectId(userId) });
    }
}

module.exports = User;