class SecuredController {
    index(req, res, index) {
        // render the secured view
        res.render('secured');
    }
}

module.exports = new SecuredController();