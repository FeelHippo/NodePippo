'use strict';

const mongoose = require('mongoose');

const conn = mongoose.connection;

conn.on('open', () => {
    console.log('Connected to MongoDB', conn.name);
    
});

conn.on('error', () => {
    console.log('An error occurred: ', err);
    process.exit(1);    
});

mongoose.connect(process.env.MONGODB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = conn;