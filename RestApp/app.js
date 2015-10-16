// Default middlewares for express framework
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// My app middlewares
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/restApp', function(error) {
    if(error) {
      console.log('connection error', error);
    } else {
      console.log('connection successful');
    }
});

// app routes configuration
var routes = require('./routes/index');
var products = require('./routes/products');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/products', products);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Page Not Found');
  err.status = 404;
  next(err);
});

//
// error handlers
//
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
