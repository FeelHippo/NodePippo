const basicAuth = require('basic-auth');

module.exports = function() {
    return (req, res, next) => {
        var user = basicAuth(req);
        if (!user || user.name !== 'user' || user.pass !== 'pass') {
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        return res.sendStatus(401);
        }
        next();
    }
} 


