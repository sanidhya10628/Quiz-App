const express = require('express');
const router = express.Router();
const User = require('../models/User')
const bcrypt = require('bcrypt');
const session = require('express-session')



// middleware
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
    res.render('dashboard', { currUser })
})

//login page
router.get('/login', (req, res) => {
    res.render('login')
})


router.post('/login', async (req, res) => {
    let errors = [];
    const { email, password } = req.body;
    const currUser = await User.findOne({ email });
    if (currUser) {
        const isValidPassword = await bcrypt.compare(password, currUser.password);
        if (isValidPassword) {
            req.session.user_id = currUser._id;
            res.redirect('/dashboard')
        }
        else {
            errors.push({ msg: 'Invalid Email or Password' })
            res.render('login', { errors, email, password })
        }
    }
    else {
        errors.push({ msg: 'Invalid Email or Password' })
        res.render('/login', { errors, email, password })
    }
})

// register page

router.get('/register', (req, res) => {
    res.render('register')
})



// post register route

router.post('/register', async (req, res) => {
    let errors = [];
    const { name, email, password, password2 } = req.body;
    const isUser = await User.findOne({ email: email })
    if (!isUser) {
        const hash = await bcrypt.hash(password, 12);
        const newUser = await new User({
            name,
            email,
            password: hash
        })

        await newUser.save();
        res.redirect('/login');
    }
    else {
        errors.push({ msg: 'Email already exists! Try Using another Email' })
        res.render('register', { errors, name, email, password, password2 });
    }
})

// Log Out
router.post('/logout', (req, res) => {
    req.session.user_id = null;
    res.redirect('/');
})


module.exports = router;