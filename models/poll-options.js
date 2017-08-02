var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PollOptions = new Schema({
  poll: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Polls'
    }
  },
  option: String,
  count: Number
});

module.exports = mongoose.model('PollOptions', PollOptions);
