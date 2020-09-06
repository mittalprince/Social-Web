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

const connect = mongoose.connect(mongo_uri, { useUnifiedTopology: true, useNewUrlParser: true});
connect.then((db)=>{
    console.log("Database Connected Successfully");
}, (err)=>{
    console.log("Error occur while connecting ", err);
})
// ----------------------------------

// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');



app.use(cors({ origin: true, credentials: true }))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


// setup passport with express-session-----------
app.use(express_session({
    secret: process.env.express_session_secret,
    resave: false,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());
//-------------------------------------------------



// Route Handling-------------------------
var indexRouter = require('./routes/index');
var porfileRouter = require('./routes/profile');
var userRouter = require('./routes/user');
var postsRouter = require('./routes/post');
// ---------------------------------------



app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/profile', porfileRouter);
app.use('/posts', postsRouter);


// common error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = err;

    // render the error page
    res.status(err.status || 500);
    res.send(undefined);
});



let port = process.env.PORT || 8000

app.listen(port, ()=>{
    console.log(`Server is listening on port ${port}`);
})