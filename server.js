var express = require('express');
var app = express(),
    morgan = require('morgan'),
    mongoose = require('mongoose'),
    session = require('express-session'),
    passport = require('passport'),
    twitter = require('./auth/twitter'),
    bodyParser = require('body-parser'),
    Poll = require('./models/polls'),
    PollOption = require('./models/poll-options.js'),
    User = require('./models/users');
    port = process.env.PORT || 8080,
    ip = process.env.IP;

require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI);

app.use(bodyParser.urlencoded({ extended: true}));
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
  Poll.find({}, function(err, polls) {
    if (err) {
      res.status(400).json({'message':'error retrieving polls'})
    } else {
      res.render('index', {
        user: req.user || '',
        polls: polls || []
      });
    }
  });
});

app.get('/auth/twitter', twitter.authenticate('twitter'));
app.get('/auth/twitter/callback', twitter.authenticate('twitter', { failureRedirect: '/login' }), function(req, res) {
  res.redirect('/');
});

app.get('/login', function(req, res) {
  res.render('login', { user: req.user || '' });
});

app.get('/add', isLoggedIn, function(req, res) {
  res.render('add', { user: req.user || '' });
}).post('/add', isLoggedIn, function(req, res) {
  var question = req.body.question;
      options = req.body.options.split('\r\n');
  Poll.create({
    user: {
      id: req.user._id
    },
    question: question
  }, function(err, poll) {
    if (err) {
      return res.status(400).json({'message': 'error saving poll'});
    } else {
      User.findOne({ _id: req.user._id }, function(err, foundUser) {
        if (err) {
          return res.status(400).json({'message':'User not found'});
        } else {
          foundUser.polls.push(poll);
          foundUser.save(function(err, user) {
            if (err) { return res.status(400) }
            else {
              options.forEach(function(option) {
                PollOption.create({
                  poll: {
                    id: poll._id
                  },
                  option: option,
                  count: 0
                }, function(err, pollOption) {
                  if (err) {
                    return res.status(400).json({'message': 'error saving option'});
                  } else {
                    Poll.findOne({ _id: poll._id }, function(err, foundPoll) {
                      if (err) {
                        return res.status(400).json({'message': 'error finding poll'});
                      } else {
                        foundPoll.options.push(pollOption);
                        foundPoll.save(function(err, poll) {
                          if (err) { return res.status(400) }
                        });
                      }
                    });
                  }
                });
              });
              res.redirect('/my_polls');
            }
          });
        }
      });
    }
  });
})

app.get('/edit_delete/:poll_id', isLoggedIn, function(req, res) {
  res.render('edit_delete');
});

app.get('/my_polls', isLoggedIn, function(req, res) {
  User.findOne({ _id: req.user._id }).populate('polls').exec(function(err, user) {
    res.render('my_polls', {
      user: req.user || '',
      polls: user.polls || []
    });
  })
});

app.get('/vote_poll', function(req, res) {
  res.render('/vote_poll');
});

app.get('/logout', isLoggedIn, function(req, res) {
  req.logout();
  res.redirect('/')
});

function isLoggedIn(req, res, next) {
  if (req.user) {
    return next();
  }
  res.redirect('/login');
}

app.listen(port, ip, function() {
  console.log('Server started at port ' + port);
});
