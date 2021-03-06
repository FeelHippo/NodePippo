'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const transporter = require('../lib/nodemailerConfig');

// define schema
const userSchema = mongoose.Schema({
    email: {
        type: String,
        unique: true // very important to make DB queries reliable and quick
    },
    password: String,
});

userSchema.statics.hashPassword = function(plainPassword) {
    return bcrypt.hash(plainPassword, 10);
}

userSchema.methods.sendEmail = function(from, subject, body) {
    
    // send an email, async operation
    return transporter.sendMail({
        from: from,
        to: this.email,
        subject: subject,
        html: body
    }, (err, info) => {
        if (err) {
            console.log('User.js', err);
        } else {
            console.log('User.js', info);
        }
    })
}

// use schema to create a model
const User = mongoose.model('User', userSchema);

// export model
module.exports = User;