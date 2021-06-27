const express = require('express')
const router = express.Router();
const Admin = require('../models/Admin')
const bcrypt = require('bcrypt');



//Register get
router.get('/adminregister', (req, res) => {
    res.render('admin/adminRegister');
})


// post register route

router.post('/adminregister', async (req, res) => {
    let errors = [];
    const { adminId, name, email, password, password2 } = req.body;
    const isAdminId = await Admin.findOne({ adminId: adminId })
    const isAdminemail = await Admin.findOne({ email: email })
    if (!isAdminId && !isAdminemail) {
        const hash = await bcrypt.hash(password, 12);
        const newAdmin = await new Admin({
            adminId: adminId,
            name: name,
            email: email,
            password: hash
        })

        await newAdmin.save();
        res.redirect('/adminlogin');
    }
    else if (!isAdminId) {
        errors.push({ msg: 'Email already exists! Try Using another Email' })
        res.render('register', { errors, adminId, name, email, password, password2 });
    }
    else {
        errors.push({ msg: 'Admin Id already exists! Try Using another Admin Id' })
        res.render('register', { errors, adminId, name, email, password, password2 });
    }
})






//login get
router.get('/adminlogin', (req, res) => {
    res.render('admin/adminLogin');
})




router.post('/adminlogin', async (req, res) => {
    let errors = [];
    const { adminId, password } = req.body;
    const currAdmin = await Admin.findOne({ adminId });
    if (currAdmin) {
        const isValidPassword = await bcrypt.compare(password, currAdmin.password);
        if (isValidPassword) {
            req.session.user_id = currAdmin._id;
            res.redirect('/admindashboard')
        }
        else {
            errors.push({ msg: 'Invalid Admin Id or Password' })
            res.render('adminLogin', { errors, adminId, password })
        }
    }
    else {
        errors.push({ msg: 'Invalid Admin Id or Password' })
        res.render('/adminLogin', { errors, adminId, password })
    }
})






// middleware to access some pages to only logged in users
const isAdminLogin = (req, res, next) => {
    if (!req.session.user_id) {
        res.redirect('/');
    }
    else {
        next();
    }
}



// after successful Login
router.get('/admindashboard', isAdminLogin, async (req, res) => {

    const currAdmin = await Admin.findById(req.session.user_id);
    res.render('admin/admindashboard', { currAdmin })
})


router.get('/adminprofile', isAdminLogin, async (req, res) => {
    const currAdmin = await Admin.findById(req.session.user_id);
    res.render('admin/adminprofile', { currAdmin })
})

router.get('/createquiz', isAdminLogin, (req, res) => {
    res.render('admin/createquiz')
})


// Log Out
router.post('/adminlogout', isAdminLogin, (req, res) => {
    req.session.user_id = null;
    res.redirect('/');
})

module.exports = router;