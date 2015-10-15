var mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
  id: Number,
  name: String,
  price: Number,
  updated: { type: Date, default: Date.now },
});


module.exports = mongoose.model('Product', productSchema);