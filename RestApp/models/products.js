var mongoose = require('mongoose');
var db = require('../db');

var PRODUCT_COLL_NAME = 'products'; // Products table in db name
var MAX_SAFE_INT = 9007199254740991;

var ERROR = {
    INVALID_ID: "A unique positive product ID is required.",
    INVALID_NAME: "A product name is required.",
    INVALID_ID_RANGE: "Product ID must be a valid positive integer"
};

// Database schema for Product model
var productSchema = new mongoose.Schema({
    id: Number,
    name: String,
    price: Number,
    updated: { type: Date, default: Date.now }
});

// Create mongoose model
mongoose.model('Product', productSchema);

// Database search project specifies which fields to return
var searchProjection = {
    _id: 0,     // Object id needs to be explicitly removed
    id: 1,
    name: 1,
    price: 1
}

// Static methods accessible in controller
function ProductModel() { }

// GET All /products/
ProductModel.getAll = function getAll(callBack) {
    var searchQuery = {},  // Return all products
        productCollection = db.get().collection(PRODUCT_COLL_NAME);

    productCollection.find(searchQuery, searchProjection).toArray(function (err, docs) {
        callBack(err, { product: docs });
    });
}

// GET - returns unique product id
ProductModel.get = function get(searchId, callBack) {
    var searchQuery,
        productCollection = db.get().collection(PRODUCT_COLL_NAME);

    if (!!Number(searchId)) {
        // Check for valid product id
        searchQuery = { id: Number(searchId) };

        productCollection.find(searchQuery, searchProjection).toArray(function (err, docs) {
            callBack(err, { product: docs });
        });
    } else {
        // Bad request
        callBack(null, { error: { id: ERROR.INVALID_ID } });
    }
}

// Creates new product
// param represents Input Product properties
// Product id must be unique
// Product name must be atleast 1 char long
// Product price should be greater than 0
ProductModel.create = function create(param, callBack) {
    var productCollection = db.get().collection(PRODUCT_COLL_NAME),
        newProduct = {};

    param.price = param.price | 0;

    if (isValidProduct(param)) {
        // Create new product document
        
        newProduct.id = Number(param.id);
        newProduct.name = param.name;
        newProduct.price = Number(param.price);
        newProduct.updated = Date.now;

        productCollection.insert(newProduct, function (err, result) {
            callBack(err, { message: result["insertedCount"] + ' product created successfully.' });
        });
    } else {
        // Build bad response with meaningful data
        callBack(null, { error: getInvalidProductError(param) });
    }
}

ProductModel.update = function update(productId, updateData, callBack) {
    var productCollection = db.get().collection(PRODUCT_COLL_NAME),
        newProd = {};
    
    // Selective field updates
    // If user sends only price to update then keep all other fields as it is.
    if (updateData) {
        if (updateData.id) {
            newProd.id = Number(updateData.id);
        }
        if (updateData.name) {
            newProd.name = updateData.name;
        }
        if (updateData.price) {
            newProd.price = Number(updateData.price);
        }
    }
    
    productCollection.update({ id: Number(productId) }, { $set: newProd }, {}, function (err, r) {
        var changeCount = r.result['n'],
            outMessage = "No document updated";

        if (changeCount) {
            outMessage = changeCount + ' product updated.';
        }
        callBack(err, { message: outMessage});
    });
}

ProductModel.delete = function (productId, callBack) {
    var productCollection = db.get().collection(PRODUCT_COLL_NAME);
    
    productCollection.removeOne({ id: Number(productId) }, { w: 1 }, function (err, r) {
        var changeCount = r.result["n"],    // 
            outMessage = "No product deleted.";

        if (changeCount) {
            outMessage = changeCount + ' product deleted.';
        }

        callBack(err, { message: outMessage});
    });
}

// Destroy All (UN SAFE) -  DELETE - /products/
ProductModel.deleteAll = function deleteAll(callBack) {
    var productCollection = db.get().collection(PRODUCT_COLL_NAME);
    
	// Remove all documents from product collection
	productCollection.remove({}, function(err, r) {
        callBack(err, { message: r.result["n"] + ' product deleted.'});
	});
};

// HELPER FUNCTIONS

// Valid Product rules:
// a) Product ID must be a positive integer
// b) Product Name must be atleast one char long
// c) Price is optional but if present should be a valid number
function isValidProduct(product) {
    if (product &&
        product.id &&
        !!Number(product.id) &&
        product.name &&
        product.id > 0 &&
        product.id < MAX_SAFE_INT &&
        (product.price ? !!Number(product.price) : true)) {
        return true;
    }
    return false;
}

// Bad request
function getInvalidProductError(product) {
    var response = {};

    if (!product || !product.id || !Number(product.id) || product.id < 0) {
        response.id = ERROR.INVALID_ID;
    }

    if (!product || !product.name) {
        response.name = ERROR.INVALID_NAME;
    }

    return response;
}

// export Product model
module.exports = ProductModel;