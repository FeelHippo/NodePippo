var express = require('express');
var router = express.Router();
var path = require('path');
const debug = require('debug')('myapp:server');
var multer = require('multer');
const axios = require('axios');

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../NodePippo/public/images')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
});

const upload = multer({ storage: storage });


/* Add new Ad Form */
router.get('/', function(req, res, next) {
  res.render('form', { title: 'NodePippo API'});
});

router.post('/', upload.single('picture'), async (req, res, next) => {
  try {
    debug(req.file);
    
    await axios.post('https://localhost:3000/api/ads', {
      name: req.body.name,
      sell: req.body.sell,
      price: req.body.price,
      picture: req.file.filename,
      tags: [req.body.tag1, req.body.tag2]
    });
    
    res.redirect('/');
    // skip to the next middleware, which will invoke the AMQP publisher
    next();
  } catch (error) {
    console.log(error)
  };  
});

module.exports = router;



