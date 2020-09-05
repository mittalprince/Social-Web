const express = require('express');
const app = express();

const path = require('path');
const dotenv = require('dotenv').config();
const cors = require('cors');

const passport = require('passport');
const express_session = require('express-session');

// Database Setup------------------
const mongoose = require('mongoose');
const mongo_uri = process.env.mongo_uri;

const connect = mongoose.connect(mongo_uri, {useUnifiedTopology: true, useNewUrlParser:true});
connect.then((db)=>{
    console.log("Database Connected Successfully");
}, (err)=>{
    console.log("Error occur while connecting ", err);
})
// ----------------------------------

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(cors({ origin: true, credentials: true }))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// setup passport with express-session
app.use(express_sessions({
    secret: process.env.express_session_secret
}));
app.use(passport.initialize());
app.use(passport.session());


let port = process.env.PORT || 8000

app.listen(port, ()=>{
    console.log(`Server is listening on port ${port}`);
})