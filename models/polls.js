var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Poll = new Schema({
  user: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'twitter_users'
    }
  },
  question: String
});

module.exports = mongoose.model('Polls', Poll);
