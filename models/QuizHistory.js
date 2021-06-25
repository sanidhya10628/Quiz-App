const mongoose = require('mongoose');


const PastQuizSchema = new mongoose.Schema({

    lastQuizMarks: {
        type: Number,
        required: true
    },
    lastQuizTime: {
        type: String,
        required: true
    },
    lastQuizDate: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    }
})

const PastQuiz = mongoose.model('PastQuiz', PastQuizSchema)

module.exports = PastQuiz;