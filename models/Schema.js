'use strict';

const mongoose = require('mongoose');

// define schema
const adScheme = mongoose.Schema({
    name: String,
    sell: Boolean,
    price: Number,
    picture: String,
    tags: [String]
});


// use schema to create a model
const Ad = mongoose.model('Ad', adScheme);

// export model
module.exports = Ad;