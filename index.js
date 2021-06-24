const express = require("express")
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/User')
const HomeRoute = require('./routes/app')
const UsersRoute = require('./routes/users')
const session = require('express-session')

mongoose.connect('mongodb://localhost:27017/Quiz-App', { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("Connection is on!....")
}).catch(err => {
    console.log("Error");
    console.log(err);
});




// Body Parser
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }))
app.use(session({ secret: 'notagoodsecret', resave: false, saveUninitialized: false }))

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));


app.use('/', HomeRoute); // for displaying Home Page
app.use('/', UsersRoute); // for displaying Login and Register Pages

app.listen(8000, () => {
    console.log("ON Port : 8000");
})