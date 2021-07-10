const mongoose = require('mongoose');


const CreateQuizSchema = mongoose.Schema({
    // quizTitle: {
    //     type: String,
    //     required: true
    // },
    // quizDesc: {
    //     type: String,
    //     required: true
    // },
    question: {
        type: String,
        required: true
    },
    option1: {
        type: String,
        required: true
    },
    option2: {
        type: String,
        required: true
    },
    option3: {
        type: String,
        required: true
    },
    option4: {
        type: String,
        required: true
    },
    correct_answer: {
        type: String,
        required: true
    }
})

const CreateQuiz = mongoose.model('CreateQuiz', CreateQuizSchema);

module.exports = CreateQuiz;