const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class LoginController {
    index(req, res, next) {
        // when we first load the login form, the field VALUE is blank
        res.locals.email = '';
        // set a response for a possible error, use translator
        res.locals.error = '';
        // same funcionality as a router element, and will render the login view
        res.render('login');
    }
    async post(req, res, next) {
        try {
            const email = req.body.email;
            const password = req.body.password;

            // query to DDBB
            const user = await User.findOne({ email });
            // if no users were found, or the password provided is wrong:
            if (!user || !await bcrypt.compare(password, user.password)) {
                //return user's email to login form
                res.locals.email = email;
                //set a response for a possible error, use translator
                res.locals.error = res.__('invalid credentials');
                res.render('login');
                return;
            }
            // search user and password
            // keep track of user ID in his personal secured session
            req.session.authUser = {
                _id: user._id
            }
            
            // a user was found and the password is correct
            res.redirect('/secured');

            // send a confirmation email to the user
            await user.sendEmail(process.env.ADMIN_EMAIL, 'Security Alert', 'If you did not grant access, you should check this activity and secure your account.');
        } catch (error) {
            console.log(error);
            
        }
    }

    async postJWT(req, res, next) {
        try {
            const email = req.body.email;
            const password = req.body.password;
            
            // query to DDBB
            const user = await User.findOne({ email });
            // if no users were found, or the password provided is wrong:
            if (!user || !await bcrypt.compare(password, user.password)) {
                const error = new Error('invalid credentials');
                error.status = 401;
                next(error);
                return;
            }
            // create a JWT token
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
                expiresIn: '7d' // 1 week
            });
            
            // return token to server
            res.json({ token: token });
            
        } catch (error) {
            console.log(error);
        }
    }

    logout(req, res, next) {
        // delete current session, so as to logout, and create a new one
        req.session.regenerate(err => {
            if (err) {
                next(err);
                return;
            }
            res.redirect('/');
        })
    }
}

module.exports = new LoginController