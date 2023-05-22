const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        minlength: [5, 'Min 5 chars'],
    },
    email: {
        type: String,
        required: true,
        minlength: [10, 'Email must be at least 10 characters long']
    },
    password: {
        type: String,
        required: true,
        minlength: [4, 'Password must be at least 4 characters long']
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;