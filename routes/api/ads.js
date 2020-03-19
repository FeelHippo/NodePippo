'use strict';

const express =require('express');
const router = express.Router();

const Ad = require('../../models/Schema');

// get all ads
router.get('/', async (req, res, err) => {
    try {
        const params = filter_ads(req);
        console.log(params);
        const ads = await Ad.find(params).exec(function (err, data) {
            res.json(data);
        });
    
    } catch (error) {
        console.log(error);
        next(err);        
    }
});

const filter_ads = (req) => {
    
    let name = req.query.name,
        sell = req.query.sell,
        min = req.query.min || 0,
        max = req.query.max || 1000000,
        tags = [], 
        params = {};
          
    if (name && name !== 'undefined' && name !== '') {
        params.name = name;
    };
    
    if (sell && sell !== 'undefined') {
        params.sell = (sell === 'true') ? true : false;
    }
        
    params.price = {$gte : parseFloat(min), $lte : parseFloat(max)}
    console.log(typeof req.query.tags)
    if (typeof req.query.tags == 'string') {
        params.tags = req.query.tags;
    } else if (req.query.tags && req.query.tags !== 'undefined') {
        params.tags = tags.concat(req.query.tags.split(','));
    }
    console.log(params);
    
    return params;
  }
  

module.exports = router;




