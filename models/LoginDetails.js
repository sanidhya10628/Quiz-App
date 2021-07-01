const mongoose = require('mongoose');

const LastLoginSchema = mongoose.Schema({
    LastUserLogin: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    }
})


const LastLoginDetail = mongoose.model('LastLoginDetail', LastLoginSchema);

module.exports = LastLoginDetail;