var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var IpAddress = new Schema({
  ip: String,
  polls: [ String ]
});

module.exports = mongoose.model('IpAddress', IpAddress)
