var express = require('express');
var router = express.Router(),
    twitter = require('../auth/twitter'),
    Poll = require('../models/polls'),
    PollOption = require('../models/poll-options.js'),
    IpAddress = require('../models/ip-address.js'),
    User = require('../models/users');

router.get('/', function(req, res) {
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
})

.get('/auth/twitter', twitter.authenticate('twitter'))
.get('/auth/twitter/callback', twitter.authenticate('twitter', { failureRedirect: '/login' }), function(req, res) {
  res.redirect('/');
});

router.get('/login', function(req, res) {
  res.render('login', { user: req.user || '' });
});

router.get('/logout', isLoggedIn, function(req, res) {
  req.logout();
  res.redirect('/')
});

function isLoggedIn(req, res, next) {
  if (req.user) {
    return next();
  }
  res.redirect('/login');
}

router.get('/add', isLoggedIn, function(req, res) {
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
              res.redirect('/my_polls?message=Poll successfully added');
            }
          });
        }
      });
    }
  });
});

router.get('/edit_delete/:poll_id', isLoggedIn, function(req, res) {
  Poll.findOne({ _id: req.params.poll_id })
    .populate('options')
    .exec(function(err, foundPoll) {
      var text = []
      foundPoll.options.forEach(function(o) {
        text.push(o.option);
      });
      foundPoll.text = text.join('\r\n');
      res.render('edit_delete', {
        user: req.user || '',
        poll: foundPoll
      });
    })
})
.delete('/delete/:poll_id', isLoggedIn, function(req, res) {
  // delete poll
  var poll_id = req.params.poll_id;
  Poll.findOne({ _id: poll_id }, function(err, poll) {
    if (err) { res.status(400).json({'error':'error finding poll'})}
    else {
      poll.options.forEach(function(id) {
        PollOption.findByIdAndRemove(id, function(err, d) {
          console.log(d);
        });
      });
      poll.remove();
      res.status(200).json({'success':'deleted poll'});
    }
  });
});

router.get('/my_polls', isLoggedIn, function(req, res) {
  User.findOne({ _id: req.user._id })
    .populate('polls')
    .exec(function(err, user) {
      res.render('my_polls', {
        user: req.user || '',
        polls: user.polls || [],
        message: req.query.message || ''
      });
    })
});

router.get('/vote_poll/:poll_id', function(req, res) {
  Poll.findOne({ _id: req.params.poll_id })
    .populate('options')
    .exec(function(err, foundPoll) {
      res.render('vote_poll', {
        user: req.user || '',
        poll: foundPoll
      });
    })
  })
  .post('/vote_poll/:poll_id', function(req, res) {
    // look for ip
    var ip = req.ip,
        poll_id = req.params.poll_id;
        vote_id = req.body.vote_id;
    IpAddress.findOne({ ip: ip}, function(err, ipadd) {
      if (err) { res.status(400).json({'error':'error finding ip'})}
      if (ipadd) {
        // check if ipadd has the poll id
        var index = ipadd.polls.indexOf(poll_id);
        if (index === -1) {
          // add poll id to ip address
          ipadd.polls.push(poll_id);
          ipadd.save();
          // increment vote to poll-option
          PollOption.findOne({ _id: vote_id }, function(err, poll_option) {
            if (err) { res.status(400).json({'message':'error finding poll option'})}
            poll_option.count += 1;
            poll_option.save();
            res.redirect('/vote_poll/' + poll_id);
          });
        } else {
          // else ip found
          res.status(400).json({'message':'Sorry this ip address cannot vote more than once in this poll'});
        }
      } else {
        // no existing ip address, create new ip address
        var newIp = new IpAddress({
          ip: ip,
          polls: [poll_id]
        })
        newIp.save();
        // increment vote to poll-option
        PollOption.findOne({ _id: vote_id }, function(err, poll_option) {
          if (err) { res.status(400).json({'message':'error finding poll option'})}
          poll_option.count += 1;
          poll_option.save();
          res.redirect('/vote_poll/' + poll_id);
        });
      }
    });
  });

module.exports = router;
