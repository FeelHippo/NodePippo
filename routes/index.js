var express = require('express');
var router = express.Router();

const axios = require('axios');

/* GET home page. */
router.get('/', async (req, res, next) => {
  try {
    let tags = [];
    const URL_API = (req.url === '/') ? 
          'https://localhost:3000/api/ads'   
          : `https://localhost:3000/api/ads?${typeof req.query.tags == Array ? req.query.tags.map(tag => `tags=${tag}&`).join('') : `tags=${req.query.tags}&`}sell=${req.query.sell}&min=${req.query.min}&max=${req.query.max}&name=${req.query.name}`
        
    let chunk = await axios.get(URL_API);
    if(chunk) {
      chunk.data.map(el => {
        tags = [...tags, ...el.tags];
      });
      var unique_tags = tags.filter((v, i, a) => a.indexOf(v) === i);
    };    

    res.render('index', { title: 'NodePippo API', chunk: chunk.data, tags: unique_tags });
  } catch (error) {
    console.log('Could not retrieve data: ', error);
    next(1);
  }
})

module.exports = router;
