// Products routes setup

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Product = require('../models/products.js');

function isObjectId(n) {
	return mongoose.Types.ObjectId.isValid(n);
}

// READ ALL - GET : return all products in database
// URL: /products
router.get('/', function (req, res, next){
	Product.find(function (error, queryResult) {
		if(error) {
			return next(error);
		}	
		res.json(queryResult);
	});
});

// Read - GET : return unique product
// URL: /products/:id
router.get('/:id', function(req, res, next) {
	var productId;
	
	// Check for valid product id
	if(!!Number(req.params.id)) {
		productId = req.params.id;
	}
	
	Product.find({id: productId}, function (error, queryResult) {
		if(error) {
			return next(error);
		}
		res.json(queryResult);
	});
});

// Create - POST - Create a new product
// URL: /products
router.post('/', function (req, res, next) {
	
	Product.create(req.body, function (error, queryResult) {
		if(error) {
			return next(error);
		}
		res.json(queryResult);
	});
}); 

// Update - PUT
// URL: /products/id
router.put('/:id', function (req, res, next) {
	Product.findOneAndUpdate({id: req.params.id}, req.body, function (error, queryResult) {
		if(error) {
			return next(error);
		}
		res.json(queryResult);
	});
});

// Destroy - DELETE 
// URL: /products/id
router.delete('/:id', function (req, res, next) {
	Product.findOneAndRemove({id: req.params.id}, function (error, queryResult) {
		if(error) {
			return next(error);
		}
		res.json(queryResult);
	});
});

// Destroy All (UN SAFE) -  DELETE - /products/
router.delete('/', function (req, res, next) {
	// Remove all documents from product collection
	Product.remove({}, function(err, result) {
		if(err) {
			return res.json('Delete error');
		}
		res.json(result);
	});
});

module.exports = router;