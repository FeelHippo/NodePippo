var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var serveIndex = require('serve-index');

var app = express();

//connect Mongoose
require('./lib/connectMongoose');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').__express);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/ftp', express.static('public'), serveIndex('public', {'icons': true}));
// static images 
app.use(express.static(path.join(__dirname, 'public/images')));


// API Routes MongoDB
app.use('/api/ads', require('./routes/api/ads'));

app.use('/', require('./routes/index'));
app.use('/addAd/form', require('./routes/form'));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  if(err.array) { // validation error
    err.status = 422;
    const errInfo = err.array({ onlyFirstError: true })[0];
    err.message = isAPIRequest(req) ?
    { message: 'Not Valid', errors: err.mapped() }
    : `Parameter ${errInfo.param} ${err.errInfo.msg}`
  }
  res.status(err.status || 500);

  if(isAPIRequest(req)) {
    res.json({ error: err.message });
    return;
  }

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.render('error');
});

module.exports = app;
