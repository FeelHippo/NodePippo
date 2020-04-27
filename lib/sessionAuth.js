module.exports = function (roles) {
    return function(req, res, next) {
        // same condition as in securedController.js
        if(!req.session.authUser) {
            // if the user is not authorized, back to login
            res.redirect('/login');
            return;
        } 
        next();
    }
}