var express = require('express'),
	router = express.Router(),
	db = require('../db'),
	Product = require('../models/products');

var ALL_PRODUCT_SEARCH_QUERY = 'all';
var RESPONSE_TYPE = {
	SUCCESS: 'success',
	ERROR: 'error',
	FAIL: 'failed'
}


// Read all - GET : /products
// return all products
router.get('/', function (req, res, next) {

	Product.getAll(responseCallback);

	function responseCallback(err, result) {
		genericResponseHandler.call(null, res, next, err, result);
	}
});

// Read - GET - /products/productId
// returns unique product
router.get('/:id', function (req, res, next) {

	Product.get(req.params.id, responseCallback);

	function responseCallback(err, result) {
		genericResponseHandler.call(null, res, next, err, result);
	}
});

// Create - POST - /products 
// Create a new product
router.post('/', function (req, res, next) {
	Product.create(req.body, responseCallback);

	function responseCallback(err, result) {
		genericResponseHandler.call(null, res, next, err, result);
	}
});

// Update - PUT - /products/id
router.put('/:id', function (req, res, next) {
	Product.update(req.params.id, req.body, responseCallback);
	
	function responseCallback(err, result) {
		genericResponseHandler.call(null, res, next, err, result);
	}
});

// Destroy  - /products/id
// Delete a specific product
router.delete('/:id', function (req, res, next) {
	Product.delete(req.params.id, responseCallback);
	
	function responseCallback(err, result) {
		genericResponseHandler.call(null, res, next, err, result);
	}
});

// Delete All (UN SAFE)  - /products/
// router.delete('/', function (req, res, next) {
// 	// Remove all documents from product collection
// 	Product.deleteAll(responseCallback);
	
// 	function responseCallback(err, result) {
// 		genericResponseHandler.call(null, res, next, err, result);
// 	}
// });

function genericResponseHandler(res, next, err, result) {
	var response = {};

	// Internal Server Error while processing request
	if (err) {
		// Exception: pass to application middleware
		return next(err);
	}

	// Request processed but with errors
	if (result && result.error) {
		// Bad request
		response.status = RESPONSE_TYPE.FAIL;
		response.data = result.error;

		res.status(400).json(response);
	} else {
		// Success
		response.status = RESPONSE_TYPE.SUCCESS;
		response.data = result;

		res.status(200).json(response);
	}
} 

module.exports = router;