const express = require('express');
const router = express.Router();
const User = require('../models/User')
const bcrypt = require('bcrypt');
const session = require('express-session')
// const quizdata = require('../quiz-data.json')
const PastQuiz = require('../models/QuizHistory');
const { render } = require('ejs');
const fetch = require('node-fetch')

// const HighScore = require('../models/Score')
// const quiz = quizdata['data'];
// console.log(quiz) //array of objects


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
    PastQuizDetails.reverse();
    // console.log(PastQuizDetails)
    res.render('dashboard', { currUser, PastQuizDetails })
})


router.get('/profile', isLogin, async (req, res) => {
    const currUser = await User.findById(req.session.user_id);
    res.render('profile', { currUser })
})



router.get('/leaderboard', isLogin, async (req, res) => {
    const allUser = await User.find({});
    // console.log(allUsers);
    //sort by high score
    const allUsers = allUser.sort((c1, c2) => (c1.highscore < c2.highscore) ? 1 : (c1.highscore > c2.highscore) ? -1 : 0);
    // console.log(allUsers)
    res.render('leaderboard', { allUsers })

})


router.post('/takequiz', isLogin, async (req, res) => {
    const { noofquestion, selectcategory, selectdifficulty, selecttype } = req.body;
    const data = await fetch(`https://opentdb.com/api.php?amount=${noofquestion}&category=${selectcategory}&difficulty=${selectdifficulty}&type=${selecttype}`);
    const quizd = await data.json();
    const quiz = quizd['results'];
    const currUser = await User.findById(req.session.user_id);
    const username = currUser.username;
    res.render('quiz', { quiz })
})

//result
router.post('/result', isLogin, async (req, res) => {
    // console.log(req.body);
    let result = 0;
    let cnt = 1;
    const userInput = req.body;
    // const quiz = quizdata['data'];
    for (let i = 0; i < quiz.length; i++) {
        let temp = userInput[`question${cnt}`];
        cnt++;

        if (quiz[i].answer === temp) {
            result++;
        }
    }

    const currdate = new Date();
    //For time 
    const hours = currdate.getHours();
    const min = currdate.getMinutes();
    const sec = currdate.getSeconds();
    const time = `${hours}:${min}:${sec}`;

    //For Date
    const dd = currdate.getDate();
    let mm = currdate.getMonth() + 1;
    const yyyy = currdate.getFullYear();
    if (mm < 10) {
        mm = `0${mm}`;
    }
    const cdate = `${dd}-${mm}-${yyyy}`;

    // console.log(time);
    // console.log(cdate);
    const currUser = await User.findById(req.session.user_id);
    if (result > currUser.highscore) {
        const updatedUser = await User.updateOne({ username: currUser.username }, { highscore: result })
    }
    const currQuiz = await new PastQuiz({
        lastQuizMarks: result,
        lastQuizTime: time,
        lastQuizDate: cdate,
        username: currUser.username
    })
    await currQuiz.save();
    // res.render('result', { result })
    res.redirect('/dashboard')
})

//login page
router.get('/login', (req, res) => {
    res.render('login')
})


router.post('/login', async (req, res) => {
    let errors = [];
    const { username, password } = req.body;
    const currUser = await User.findOne({ username });
    if (currUser) {
        const isValidPassword = await bcrypt.compare(password, currUser.password);
        if (isValidPassword) {
            req.session.user_id = currUser._id;
            res.redirect('/dashboard')
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
module.exports = router;