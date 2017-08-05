var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var PollOptions = require('../models/poll-options');

var Poll = new Schema({
  user: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Twitter_users'
    }
  },
  picture: String,
  question: String,
  options: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PollOptions'
    }
  ]
});

module.exports = mongoose.model('Polls', Poll);
