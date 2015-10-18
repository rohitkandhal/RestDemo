var mongoose = require('mongoose');
var db = require('../db');

var PRODUCT_COLL_NAME = 'products'; // Products table in db name
var MAX_SAFE_INT = 9007199254740991;

var INVALID_ID_ERROR = "A unique positive product ID is required.",
    INVALID_NAME_ERROR = "A product name is required.",
    INVALID_ID_RANGE_ERROR = "Product ID must be a valid positive integer";

// Database schema for Product model
var productSchema = new mongoose.Schema({
    id: Number,
    name: String,
    price: Number,
    updated: { type: Date, default: Date.now }
});

// Create mongoose model
mongoose.model('Product', productSchema);

//db.get().collection(PRODUCT_COLL_NAME).createIndex({ id: 1 }, { unique: 1 });

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
        callBack(null, { error: { id: INVALID_ID_RANGE_ERROR } });
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

    // Bad request
    function getInvalidProductError(product) {
        var response = {};

        if (!product || !product.id || !Number(product.id) || product.id < 0) {
            response.id = INVALID_ID_ERROR;
        }

        if (!product || !product.name) {
            response.name = INVALID_NAME_ERROR;
        }

        return response;
    }
}

// HELPER FUNCTIONS

// Return selected fields in output
function formatProductOutput(rawProducts) {
    var out = [];

    rawProducts = Array.isArray(rawProducts) ? rawProducts : [rawProducts];

    rawProducts.forEach(function (p) {

        if (isValidProduct(p)) {

            out.push({
                id: p.id,
                name: p.name,
                price: p.price
            });
        }
    });
    return out;
}

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

// export Product model
module.exports = ProductModel;