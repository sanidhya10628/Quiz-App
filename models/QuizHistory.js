const mongoose = require('mongoose');


const PastQuizSchema = new mongoose.Schema({

    lastQuizMarks: {
        type: Number,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    NumberOfQuestion: {
        type: Number,
        required: true
    },
    Category: {
        type: String,
        required: true
    },
    Difficulty: {
        type: String,
        required: true
    }
})

const PastQuiz = mongoose.model('PastQuiz', PastQuizSchema)

module.exports = PastQuiz;