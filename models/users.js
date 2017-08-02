var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Polls = require('../models/polls');

var User = new Schema({
  name: String,
  someId: String,
  polls: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Polls'
    }
  ]
});

module.exports = mongoose.model('Twitter_users', User);
