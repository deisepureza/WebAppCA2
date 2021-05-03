//importing mongodb and db connection using this function that will get access to db
const mongodb = require('mongodb');
const getDb = require('../helper/database').getDb;

//constructor method to create a new object 
class Product {
  constructor(title, price, description, imageUrl, _id) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = _id ? new mongodb.ObjectId(_id) : null;
  }

  //save data method 
  save() {
    //getting access to the db
    const db = getDb();
    let dbOperation;
    if (this._id) {
      //Updating the products (updateOne will update an existind db object)
      dbOperation = db
      .collection('products')
      .updateOne({_id: this._id }, {$set: this });
    } else {
      //dbopreation is my insert 
      dbOperation = db
      .collection('products')
      .insertOne(this);
    }
    //returning my result
    return dbOperation
      .then(result => {
        console.log(result);
      })
    //return db.collection('products')
    //.insertOne(this)
    //.then(result => {
      //console.log(result);
    //})
    .catch(err => {
      console.log(err);
    });

  }
  //getting my products
  static fecthAll() {
    //getting access to the db in the fecthall
    const db = getDb();
    return db.collection('products')
    .find()
    .toArray()
    .then(products => {
      console.log(products);
      return products;
    })
    .catch(err => {
      console.log(err);
    });
  }

  static findById(prodId) {
    const db = getDb();
    return db.collection('products')
    .find({_id: new mongodb.ObjectId(prodId)})
    .next()
    .then(products => {
      console.log(product);
      return product;
    })
    .catch(err => {
      console.log(err);
    });
  }

  //deliting method
  static deleteById(prodId) {
    const db = getDb();
    return db
      .collection('products')
      .deleteOne({_id: new mongodb.ObjectId(prodId) })
      .then(result => {
        console.log('The product was deleted successfully!')
      })
      .catch(err => {
        console.log(err);
      });
  }
  
}

//exporting my class using save method
mmodule.exports = Product;