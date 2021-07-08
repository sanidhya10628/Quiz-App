// if (process.env.NODE_ENV !== "production") {
//     require('dotenv').config();
// }


// const dotenv = require("dotenv");
const express = require("express")
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/User')
const HomeRoute = require('./routes/app')
const UsersRoute = require('./routes/users')
const session = require('express-session')
const flash = require('connect-flash');
// const MongoDBStore = require("connect-mongo");
// const AdminRoute = require('./routes/admin')


// 'mongodb://localhost:27017/Quiz-App';

// const dbUrl = process.env.DB_URL;
mongoose.connect('mongodb://localhost:27017/Quiz-App', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});




// Body Parser
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }))


//sessions
const sessionConfig = {
    name: 'session',
    secret: 'notagoodsecret',
    resave: false,
    saveUninitialized: false
}
app.use(session({ secret: 'notagoodsecret', resave: false, saveUninitialized: false }))
app.use(flash());


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));


app.use('/', HomeRoute); // for displaying Home Page
app.use('/', UsersRoute); // for displaying Login and Register Pages
// app.use('/', AdminRoute); // for displaying Admin Route


const PORT = process.env.PORT || 8000;
app.listen(8000, () => {
    console.log("ON Port : 8000");
})