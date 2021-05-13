var createError = require('http-errors');
var express = require('express');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
var session = require('express-session');
var env = require('dotenv').config();
var models = require("./models");

var usersRouter = require('./routes/users');
var questionRouter = require('./routes/question');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(__dirname+'/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('port', process.env.PORT || 1337);
app.use(logger('dev'));
app.use(cookieParser());
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: "keyboard cat",
  cookie:{
    secure:false
  }
}));
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport, models.student);
require('./routes/index')(app,passport);
app.use('/users', usersRouter);
app.use('/question', questionRouter);

//Sync Database
models.sequelize.sync().then(function() {
  console.log('Nice! Database looks fine')
}).catch(function(err) {
  console.log(err, "Something went wrong with the Database Update!")
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(app.get('port'), function(){
  console.log(("Express server listening on port " + app.get('port')));
});

module.exports = app;
