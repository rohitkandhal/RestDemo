// Products routes setup

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Product = require('../models/products.js');

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
// URL: /products/id
router.get('/id', function(req, res, next) {
	Product.findById(req.params.id, function (error, queryResult) {
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
router.put('/id', function (req, res, next) {
	Product.findByIdAndUpdate(req.params.id, req.body, function (error, queryResult) {
		if(error) {
			return next(error);
		}
		res.json(queryResult);
	});
});

// Destroy - DELETE 
// URL: /products/id
router.delete('/id', function (req, res, next) {
	Product.findByIdAndRemove(req.params.id, req.body, function (error, queryResult) {
		if(error) {
			return next(error);
		}
		res.json(queryResult);
	});
});


module.exports = router;