// Hold all routes in app.

var express = require('express')
  , router = express.Router()
  , Product = require('../models/product')

router.use('/products', require('./products'))

router.get('/', function(req, res) {
  Comments.all(function(err, comments) {
    res.render('index', {comments: comments})
  })
})

module.exports = router