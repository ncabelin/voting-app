var express = require('express');
var app = express(),
    morgan = require('morgan'),
    mongoose = require('mongoose'),
    port = process.env.PORT || 8080,
    ip = process.env.IP;

require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI);
var userSchema = new mongoose.Schema({
  username: String,
  password: String
});
var User = mongoose.model('User', userSchema);

app.use(morgan('tiny'));
app.set('view engine', 'ejs');
app.use(express.static('static'));

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/all_polls', function(req, res) {
  res.render('all_polls');
});

app.get('/add', function(req, res) {
  res.render('add');
});

app.get('/edit_delete/:poll_id', function(req, res) {
  res.render('edit_delete');
});

app.get('/my_polls', function(req, res) {
  res.render('my_polls');
});

app.get('/vote_poll', function(req, res) {
  res.render('/vote_poll');
});

app.listen(port, ip, function() {
  console.log('Server started at port ' + port);
});
