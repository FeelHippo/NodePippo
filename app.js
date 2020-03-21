var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const debug = require('debug')('myapp:server');
var logger = require('morgan');
var multer = require('multer');
var serveIndex = require('serve-index');
const axios = require('axios');

var app = express();

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

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
app.use('/form', require('./routes/form'));

app.post('/form', upload.single('picture'), async (req, res) => {
  try {
    debug(req.file);
    console.log('storage location is ' + req.hostname + '/' + req.file.path);
    await axios.post('http://localhost:3000/api/ads', {
      name: req.body.name,
      sell: req.body.sell,
      price: req.body.price,
      picture: req.file.filename,
      tags: [req.body.tag1, req.body.tag2]
    });
    
    res.redirect('..');
  } catch (error) {
    console.log(error)
  };  
});

app.get('/:id', async (req, res) => {
  try {
    console.log(req.params);
    
    await axios.delete(`http://localhost:3000/api/ads/${req.params.id}`, req);
    res.redirect('/')
  } catch (error) {
    console.log(error);
    
  }
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
