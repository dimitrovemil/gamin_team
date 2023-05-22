const { cookieSessionName, secret } = require('../config/constants');
const jwt = require('jsonwebtoken');

exports.auth = async (req, res, next) => {
    let token = req.cookies[cookieSessionName];

    if (token) {
        jwt.verify(token, secret, ((err, decodedToken) => {
            if (err) {
                res.clearCookie(cookieSessionName);

                return res.redirect('/auth/login');
            }

            req.user = decodedToken;
            res.locals.user = decodedToken;
            next();
        }));
    } else {
        next();
    }
};

exports.isAuth = (req, res, next) => {
    if (!req.user) {
        return res.redirect('/auth/login');
    }
    next();
}

exports.isLogged = (req, res, next) => {
    if (req.user) {
        return res.redirect('/');
    }
    next();
}