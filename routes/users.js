const express = require('express');
const router = express.Router();
const User = require('../models/User')
const bcrypt = require('bcrypt');
const session = require('express-session')



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
    res.render('dashboard', { currUser })
})


router.get('/profile', isLogin, async (req, res) => {
    const currUser = await User.findById(req.session.user_id);
    res.render('profile', { currUser })
})



router.get('/leaderboard', isLogin, async (req, res) => {
    const allUsers = await User.find({});
    // console.log(allUsers);
    res.render('leaderboard', { allUsers })

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
            username,
            name,
            email,
            password: hash
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
router.post('/logout', (req, res) => {
    req.session.user_id = null;
    res.redirect('/');
})


module.exports = router;