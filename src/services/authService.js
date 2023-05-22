const User = require('../models/User');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { secret, saltRounds } = require('../config/constants');

exports.register = async (userData) => {
    let { email, username, password, repeatPassword } = userData;

    if (password !== repeatPassword) {
        //return false;
        throw { message: 'Passwords mismatch' };
    }

    let hashedPassword = await bcrypt.hash(password, saltRounds);

    let createdUser = User.create({ 
        email,
        username,
        password: hashedPassword
    });

    return createdUser;
};

exports.login = async ({ email, password }) => {
    let user = await User.findOne({ email });

    if (!user) {
        throw { message: 'Invalid email or password' };
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
        throw { message: 'Invalid email or password' };
    }

    return user;
}

exports.createToken = (user) => {
    const payload = { _id: user._id, email: user.email };
    const options = { expiresIn: '2d' };

    const tokenPromise = new Promise((resolve, reject) => {
        jwt.sign(payload, secret, options, (err, decodedToken) => {
            if (err) {
                return reject(err);
            }

            resolve(decodedToken);
        });
    });

    return tokenPromise;
}