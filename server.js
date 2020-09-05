const express = require('express');
const app = express();

const path = require('path');
const dotenv = require('dotenv').config();

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




let port = process.env.PORT || 8000

app.listen(port, ()=>{
    console.log(`Server is listening on port ${port}`);
})