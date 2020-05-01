const jwt = require('jsonwebtoken');

module.exports = function() {
    return (req, res, next) => {
        // collect the token generated after the call to postman. 
        // Default from the server post request, 
        // if that is empty from the query string, otherwise from the body
        const token = req.get('Authorization') || req.query.token || req.body.token;
        
        // no token, no authentication
        if (!token) {
            const error = new Error('no token provided');
            error.status = 401;
            // if the user is not authorized to delete an ad, redirect to login view
            return res.redirect('/login');
        }
        // once the token has been received, verify validity
        jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
            if(err) {
                err.status = 401;
                next(err);
                return;
            }
            // now store the value received (payload) inside the request object, 
            // so that once this middleware is resolved, and the application moves on to loginController.postJWT within app.js, 
            // that information will be available
            req.apiAuthUserId = payload._id;
            // next() will only be called if the middle ware is resolved without any authentication failures. 
            next();
        })

    }
}