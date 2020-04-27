const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('services', { title: 'NodePippo API'});
})

module.exports = router;