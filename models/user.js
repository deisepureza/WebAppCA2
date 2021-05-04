const mongodb = require('mongodb');
const getDb = require('../helper/database').getDb;

//using my object id constant to store the reference to the obj class
const ObjectId = mongodb.ObjectId;

//using java class to create a construct method to set data
class User {
    constructor(username, email, cart, _id) {
        this.name = username;
        this.email = email;
        this.cart = cart; // object {item: []}
        this._id = _id;
    }

    //save method to save the user to a db
    save() {
        //creating const to call db and store my db client
        const db = getDb();
        db.collection('user').insertOne(this);
    }

    //method to add into cart (will be called on a user object from data fetched from the db using findbyid)
    addToCart(product) {
        const cartProductIndex = this.cart.items.findIndex(cp => {
            return cp.productId.toString() === product._id.toString();
        });
        let newQuantity = 1;
        const updatedCartItems = [...this.cart.items];

        if (cartProductIndex >= 0) {
            newQuantity = this.cart.items[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity = newQuantity;
        } else {
            updatedCartItems.push({ productId: new ObjectId(product._id), quantity: newQuantity});
        }
        
        //method to update db
        const updatedCart = { 
            items: updatedCartItems};
        const db = getDb();
        return db
            .collection('user')
            .updateOne(
                { _id: new ObjectId(this._id) },
                { $set: {cart: updatedCart} } 
        );
    }

    //getting user cart access
    getCart() {
        const db = getDb();
        const productIds = this.cart.items.map(i => {
            return i.productId;
        });
        return db.collection('products').find({_id: {$in: productIds}}).toArray()
        .then(products => {
            return products.map(p => {
                return {...p, quantity: this.cart.items.find(i => {
                    return i.productId.toString() === p._id.toString();
                }).quantity
            };
            });
        });
    }

    //delete item from cart method
    deleteItemFromCart(productId) {
        const updatedCartItems = this.cart.items.filter(item => {
            return item.productId.toString() !== productId.toString();
        });
        const db = getDb();
        return db
            .collection('user')
            .updateOne(
                { _id: new ObjectId(this._id) },
                { $set: {cart: {items: updatedCartItems} } } 
        );
    }

    //orders method (get cart product array/create order/insert)
    addOrder() {
        const db = getDb;
        return this.getCart()
        .then(products => {
            const order = {
                items: products,
                user: {
                    _id: new ObjectId(this._id),
                    name: this.name
                }
            };
            return db.collection('orders')
            .insertOne(this.cart)
        })
        .then(result => {
            this.cart = {items: []};
            return db
            .collection('user')
            .updateOne(
                { _id: new ObjectId(this._id) },
                { $set: {cart: {items: []} } } 
        );
        });
    }

    //method to user get the order
    getOrders() {
        const db = getDb();
        return db.collection('order').find({'user._id': new ObjectId(this._id)}).toArray();

    }

    //creating a static method to find user by ID
    static findById(userId) {
        const db = getDb();
        return db.collection('user')
        .findOne({ _id: new ObjectId(userId) })
        .then(user => {
            console.log(user);
            return user;
        })
        .catch(err => { console.log(err);
        });
    }
}

module.exports = User;