class SecuredController {
    index(req, res, next) {
        // render the secured view
        res.render('secured');
    }   
}

module.exports = new SecuredController();
