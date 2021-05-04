//const mongodb = require('mongodb');
const Product = require('../models/product');

//const ObjectId = mongodb.ObjectId;

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  //passing all data into product constructor method
  const product = new Product(title, price, description, imageUrl, null, req.user._id);
    product.save().then(result => {
      console.log('New Added Product');
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
    });
  //const product = new Product(null, title, imageUrl, description, price);
  //product.save();
  //res.redirect('/');
};

//gets product page. (function to edit product. it fetch the product that has to  edited/rendering it)
exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(productId)
  //Product.findById(prodId, 
  .then(products => {
    //const product = product[0];
    if (!product) {
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product
    });
  })
  .catch(err => console.log(err));
};

//function to save the getedit changes to database
exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  
  const product = new Product(
    updatedTitle, 
    updatedPrice, 
    updatedDesc,
    updatedImageUrl,  
    prodId
  );
  product
    .save()
    .then(result => {
      console.log('The product was updated successfully!');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

  //const updatedProduct = new Product(
    //prodId,
    //updatedTitle,
    //updatedImageUrl,
    //updatedDesc,
    //updatedPrice
  //updatedProduct.save();
  //res.redirect('/admin/products');
//};

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => console.log(err));

  //Product.fetchAll(products => {
    //res.render('admin/products', {
      //prods: products,
      //pageTitle: 'Admin Products',
      //path: '/admin/products'
    //});
  //});
};

//Delete product action
exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteById(prodId)
    .then(() => {
      console.log('The product was deleted successfully');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};
