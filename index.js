const express = require("express")
const app = express();
const path = require('path');
const mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost:27017/farmStand', { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
//     console.log("Connection is on!....")
// }).catch(err => {
//     console.log("Error");
//     console.log(err);
// });

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }))


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));


app.get('/', (req, res) => {
    res.render('home.ejs');
})

app.get('/register', (req, res) => {
    res.render('register');
})

app.post('/register', (req, res) => {
    const obj = req.body;
    console.log(obj);
    res.send("Got it")
})

app.get('/login', (req, res) => {
    res.render('login');
})


app.listen(8000, () => {
    console.log("ON Port : 8000");
})