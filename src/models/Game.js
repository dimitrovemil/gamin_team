const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        minlength: [4, 'Min 4 chars'],
    },
    image: {
        type: String,
        required: true,
        match: /^https?:\/\//i
    },
    price : {
        type: Number,
        required: [true, 'Must be positive num'],
        min: 1,
    },
    genre: {
        type: String,
        required: [true, 'Genre is required'],
        minlength: [2, 'Min 2 chars'],
    },
    description: {
        type: String,
        required: [true, 'Description  is required'],
        minlength: [10, 'Min 10 chars'],
    },
    platform: {
        type: String,
        required: [true, 'Genre is required'],
        enum: ["PC", "Nintendo", "PS4", "PS5", "XBOX"]
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    boughtBy : [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }]
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;