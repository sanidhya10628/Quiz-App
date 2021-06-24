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


//login page
router.get('/dashboard', isLogin, async (req, res) => {

    const currUser = await User.findById(req.session.user_id);
    res.render('dashboard', { currUser })
})
router.get('/login', (req, res) => {
    res.render('login')
})


router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const currUser = await User.findOne({ email });
    const isValidPassword = await bcrypt.compare(password, currUser.password);
    if (isValidPassword) {
        req.session.user_id = currUser._id;
        res.redirect('/dashboard')
    }
    else {
        res.redirect('/login')
    }
})

// register page

router.get('/register', (req, res) => {
    res.render('register')
})



//

router.post('/register', async (req, res) => {
    let errors = [];
    const { name, email, password, password2 } = req.body;
    // User.findOne({ email: email }).then(user => {
    //     if (user) {
    //         // user exists
    //         errors.push({ msg: 'Email already exists' })
    //         res.render('register')
    //     } else {
    //         User.password = hashPassword(password);
    //     }
    // })

    const hash = await bcrypt.hash(password, 12);
    const newUser = await new User({
        name,
        email,
        password: hash
    })

    await newUser.save();

    res.redirect('/login');
})

// const hashPassword = async (pw) => {
//     const salt = await bcrypt.genSalt(12);
//     const hash = await bcrypt.hash(pw, salt);
//     console.log(salt);
//     console.log(hash);
// }


router.post('/logout', (req, res) => {
    req.session.user_id = null;
    res.redirect('/');
})
module.exports = router;