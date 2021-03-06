const express = require('express');
const router = express.Router();
const User = require('../models/User')
const bcrypt = require('bcrypt');
const session = require('express-session')
// const quizdata = require('../quiz-data.json')
const PastQuiz = require('../models/QuizHistory');
const { render } = require('ejs');
const fetch = require('node-fetch')
const fs = require('fs');
const LastLoginDetail = require('../models/LoginDetails');
const CreateQuiz = require('../models/CreateQuiz')

// middleware to access some pages to only logged in users
const isLogin = (req, res, next) => {
    if (!req.session.user_id) {
        res.redirect('/');
    }
    else {
        next();
    }
}


// after successful Login
router.get('/dashboard', isLogin, async (req, res) => {
    const currUser = await User.findById(req.session.user_id);
    const PastQuizDetails = await PastQuiz.find({ username: currUser.username });
    const LastLogin = await LastLoginDetail.find({ username: currUser.username });
    PastQuizDetails.reverse();
    // console.log(PastQuizDetails)
    /*flashm = {
        m: req.flash('success-login')
    }*/

    quizFlash = {
        flashMessage: req.flash('quiz-submit')
    }
    res.render('dashboard', { currUser, PastQuizDetails, LastLogin, quizFlash })
})


router.get('/profile', isLogin, async (req, res) => {
    const currUser = await User.findById(req.session.user_id);
    res.render('profile', { currUser })
})



router.get('/leaderboard', isLogin, async (req, res) => {
    const allUser = await User.find({});
    const QuizDetails = await PastQuiz.find({});
    // console.log(QuizDetails)
    // console.log(allUsers);
    //sort by high score
    const allUsers = allUser.sort((c1, c2) => (c1.highscore < c2.highscore) ? 1 : (c1.highscore > c2.highscore) ? -1 : 0);
    // console.log(allUsers)
    res.render('leaderboard', { allUsers, QuizDetails })

})

let quizAnswers = [];
let quizInfo = {};
router.post('/takequiz', isLogin, async (req, res) => {
    let { noofquestion, selectcategory, selectdifficulty } = req.body;
    const selecttype = 'multiple';
    const data = await fetch(`https://opentdb.com/api.php?amount=${noofquestion}&category=${selectcategory}&difficulty=${selectdifficulty}&type=${selecttype}`);
    const quizd = await data.json();
    const quiz = quizd['results'];
    if (selectcategory == 11) {
        selectcategory = "Films";
    }
    else if (selectcategory == 18) {
        selectcategory = "Computer Science";
    }
    else if (selectcategory == 21) {
        selectcategory = "Sports";
    }
    else if (selectcategory == 24) {
        selectcategory = "Politics";
    }
    else if (selectcategory == 26) {
        selectcategory = "Celebrities";
    }
    quizInfo = {
        noofquestion: noofquestion,
        selectcategory: selectcategory,
        selectdifficulty: selectdifficulty
    }

    for (let i = 0; i < quiz.length; i++) {
        quizAnswers.push(quiz[i]['correct_answer']);
        quiz[i]['incorrect_answers'].push(quiz[i]['correct_answer']);
        shuffle(quiz[i]['incorrect_answers']);

    }


    const currUser = await User.findById(req.session.user_id);
    const username = currUser.username;
    res.render('quiz', { quiz, username })
})

//result
router.post('/result', isLogin, async (req, res) => {
    let result = 0;
    const userInputs = req.body;
    let str = 'question';
    for (let i = 0; i < quizAnswers.length; i++) {
        let answer = quizAnswers[i];
        str = `question${i + 1}`;
        if (userInputs[str] == answer) {
            result++;
        }

    }



    const currUser = await User.findById(req.session.user_id);
    if (result > currUser.highscore) {
        const updatedUser = await User.updateOne({ username: currUser.username }, { highscore: result })
    }
    const currQuiz = await new PastQuiz({
        lastQuizMarks: result,
        username: currUser.username,
        NumberOfQuestion: quizInfo.noofquestion,
        Category: quizInfo.selectcategory,
        Difficulty: quizInfo.selectdifficulty,

    })
    await currQuiz.save();
    // res.render('result', { result })
    req.flash('quiz-submit', 'Quiz Submitted Successfully')
    res.redirect('/dashboard')
    // res.send(`Your Score is ${result}`);
})

//login page
router.get('/login', (req, res) => {
    res.render('login', { m: req.flash('success') })
})


router.post('/login', async (req, res) => {
    let errors = [];
    const { username, password } = req.body;
    const currUser = await User.findOne({ username });
    if (currUser) {
        const isValidPassword = await bcrypt.compare(password, currUser.password);
        if (isValidPassword) {
            req.session.user_id = currUser._id;
            const d = new Date();
            let date = d.getDate();
            let month = d.getMonth();
            let year = d.getFullYear();
            let hh = d.getHours();
            let mm = d.getMinutes();
            let ss = d.getSeconds();
            let day = d.getDay();
            if (hh < 10) {
                hh = `0${hh}`;
            }
            if (mm < 10) {
                mm = `0${mm}`;
            }
            const time = `${hh}:${mm}`;
            const dayArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thrusday', 'Friday', 'Saturday'];
            day = dayArray[day];
            const monthArray = ['Jan', 'Feb', 'March', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
            month = monthArray[month];

            const finalDateStr = `${month} ${date} ${year} ${time}`;
            /*Last Login Code*/
            const isLastLogin = await LastLoginDetail.findOne({ username: username });
            // console.log(isLastLogin)
            if (!isLastLogin) {

                const PreviousLogin = await new LastLoginDetail({
                    LastUserLogin: finalDateStr,
                    username: username,
                })

                await PreviousLogin.save();
            }
            else {
                const PreviousLogin = await LastLoginDetail.updateOne({ username: username }, { LastUserLogin: finalDateStr });
            }
            /*Last Login Code*/

            req.flash('success-login', `Logged in SucessFully!.`);
            res.redirect('/dashboard');
        }
        else {
            errors.push({ msg: 'Invalid Username or Password' })
            res.render('login', { errors, username, password })
        }
    }
    else {
        errors.push({ msg: 'Invalid Username or Password' })
        res.render('/login', { errors, username, password })
    }
})

// register page

router.get('/register', (req, res) => {
    res.render('register')
})



// post register route

router.post('/register', async (req, res) => {
    let errors = [];
    const { username, name, email, password, password2 } = req.body;
    const isUsername = await User.findOne({ username: username })
    const isuseremail = await User.findOne({ email: email })
    if (!isUsername && !isuseremail) {
        const hash = await bcrypt.hash(password, 12);
        const newUser = await new User({
            username: username,
            name: name,
            email: email,
            password: hash,
            highscore: 0
        })

        await newUser.save();
        req.flash('success', 'Successfully Created User Profile!. Please Login to continue.');
        res.redirect('/login');
    }
    else if (!isUsername) {
        errors.push({ msg: 'Email already exists! Try Using another Email' })
        res.render('register', { errors, username, name, email, password, password2 });
    }
    else {
        errors.push({ msg: 'Username already exists! Try Using another Username' })
        res.render('register', { errors, username, name, email, password, password2 });
    }
})

// Log Out
router.post('/logout', isLogin, (req, res) => {
    req.session.user_id = null;
    res.redirect('/');
})

// settings

router.get('/settings', isLogin, async (req, res) => {
    const currUser = await User.findById(req.session.user_id);
    res.render('settings', { currUser })
})


router.post('/settings', isLogin, async (req, res) => {
    // console.log(req.body);
    const { name, email, date, country, city, college } = req.body;
    const currUser = await User.findById(req.session.user_id);
    const changeUser = await User.updateOne({ username: currUser.username }, { name: name, email: email, date: date, country: country, city: city, college: college })
    res.redirect('/dashboard');
})




// create Quiz
router.get('/createquiz', (req, res) => {

    res.render('createQuiz');
})



router.post('/createquiz', async (req, res) => {

    const { quizTitle, quizDesc, question, option1, option2, option3, option4, correct_answer } = req.body;
    // console.log(req.body)
    // console.log(quizTitle, quizDesc, question, option1, option2, option3, option4, correct_answer);

    for (let i = 0; i < question.length; i++) {
        const newquiz = await new CreateQuiz({
            question: question[i],
            option1: option1[i],
            option2: option2[i],
            option3: option3[i],
            option4: option4[i],
            correct_answer: correct_answer[i]
        })
        await newquiz.save();
    }

    res.redirect('/dashboard')
})






















function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}











module.exports = router;

