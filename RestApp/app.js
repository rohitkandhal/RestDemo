// Default middlewares for express framework
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');

// Database configuration
var db = require('./db');
var products = require('./controllers/products');
var DB_URL = 'mongodb://localhost/restApp';

db.connect(DB_URL, function (err) {
    if (err) {
        console.log('Unable to connect to database');
    } else {
        console.log('Connection successful...')
    }
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/products', products);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        
        // Response: 500 Internal Server Error with message
        res.status(err.status || 500).json({
            status: 'error',
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    // Response: 500 Internal Server Error with message
    res.status(err.status || 500).json({
        status: 'error',
        message: err.message
    });
});


module.exports = app;
