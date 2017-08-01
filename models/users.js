var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
  name: String,
  someId: String
});

module.exports = mongoose.model('twitter_users', User);
