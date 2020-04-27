var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var serveIndex = require('serve-index');
// import express session, to gain access to all individual sessions via req.session
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

var app = express();
console.log('HHHHEEEEEELLLLLLOOOOOOOOO', process.env);

//connect Mongoose, prepare to be used with MongoStore for session persistence
const mongooseConnection = require('./lib/connectMongoose');


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

// setup i18n here to avoid conflicts with cookieParser()
const i18n = require('./lib/i18nConfigure')();
app.use(i18n.init);

// avoid default try request /favicon.ico 
function ignoreFavicon(req, res, next) {
  if (req.originalUrl === '/favicon.ico') {
    res.status(204).json({nope: true});
  } else {
    next();
  }
}

app.use(ignoreFavicon);

app.locals.title = 'NodePippo';

// import session authorization, used in '/secured' route
const sessionAuth = require('./lib/sessionAuth');

// import controller for login form
const loginController = require('./routes/loginController')
const securedController = require('./routes/securedController')

app.use(session({
  name: 'nodepippo-sessions',
  secret: process.env.SESSION_SECRET,
  saveUninitialized: true,
  resave: false,
  cookie: {
    secure: true, // the browser will only send this to the server if we are using https
    maxAge: 1000 * 60 * 60 * 24 * 2 // 2 days
  },
  store: new MongoStore({
    // pass in connection to the DDBB
    mongooseConnection: mongooseConnection
  })
}))

// make the obj session avaialble to all views 
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
})

app.use('/', require('./routes/index'));
app.use('/form', require('./routes/form'));
app.use('/services', require('./routes/services'));
app.use('/change-locale', require('./routes/change-locale'))
// API Routes MongoDB
app.use('/api/ads', require('./routes/api/ads'));
app.use('/deleteAd/:id', require('./routes/api/deleteAd'));
app.get('/login', loginController.index);
app.post('/login', loginController.post);
app.get('/logout', loginController.logout);
// the below says, use the view secured, get back the middleware we call with our admin privilege (sessionAuth() returns a function), then implement securedController.index
app.get('/secured', sessionAuth(['admin']), securedController.index);
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

function isAPIRequest(req) {
  return req.originalUrl.startsWith('/api/ads');
}


module.exports = app;
