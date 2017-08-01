var express = require('express');
var app = express(),
    morgan = require('morgan'),
    mongoose = require('mongoose'),
    session = require('express-session'),
    passport = require('passport'),
    twitter = require('./auth/twitter'),
    User = require('./models/users');
    port = process.env.PORT || 8080,
    ip = process.env.IP;

require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI);

app.use(morgan('tiny'));
app.use(session({
  secret: process.env.TWITTER_SECRET,
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.set('view engine', 'ejs');
app.use(express.static('static'));

app.get('/', function(req, res) {
  var user = req.user || '';
  res.render('index', { user: user });
});

app.get('/auth/twitter', twitter.authenticate('twitter'));
app.get('/auth/twitter/callback', twitter.authenticate('twitter', { failureRedirect: '/login' }), function(req, res) {
  res.redirect('/');
});

app.get('/login', function(req, res) {
  res.render('login');
});

app.get('/add', isLoggedIn, function(req, res) {
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

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/')
});

function isLoggedIn(req, res, next) {
  console.log(req.user);
  if (req.user) {
    return next();
  }
  res.redirect('/login');
}

app.listen(port, ip, function() {
  console.log('Server started at port ' + port);
});
