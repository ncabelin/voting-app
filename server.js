var express = require('express');
var app = express(),
    morgan = require('morgan');
    port = process.env.PORT || 8080,
    ip = process.env.IP;

app.use(morgan('tiny'));
app.set('view engine', 'ejs');
app.use(express.static('static'));
app.get('/', function(req, res) {
  res.render('index');
});

app.listen(port, ip, function() {
  console.log('Server started at port ' + port);
});
