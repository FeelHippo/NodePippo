const express =require('express');

const Ad = require('../../models/Schema');

const deleteAd = async (req, res, next) => {
    
    try {
        const { id } = req.params;
        await Ad.findOneAndRemove({
            _id: id
        }, req.body, function (err, data) {
            if (!err) {
                console.log('Ad has been removed');
            }
        })

        res.redirect('/');

    } catch (error) {
        console.log(error);
    }
};

module.exports = deleteAd;