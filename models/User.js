const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    highscore: {
        type: Number,
        required: true
    },
    date: {
        type: String,
        required: false
    },
    country: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: false
    },
    college: {
        type: String,
        required: false
    }

})

const User = mongoose.model('User', UserSchema);

module.exports = User;