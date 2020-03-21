var express = require('express');
var router = express.Router();


/* Add new Ad Form */
router.get('/', function(req, res, next) {
  res.render('form', { title: 'NodePippo API'});
});

module.exports = router;



