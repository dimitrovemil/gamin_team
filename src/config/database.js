const mongoose = require('mongoose');

const connectionString = 'mongodb://localhost:27017/gaming-team';

exports.initializeDatabase = () => mongoose.connect(connectionString);