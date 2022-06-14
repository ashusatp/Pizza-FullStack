require('dotenv').config();
const express = require('express');
const app = express();
const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('express-flash');
const MongoDbStore = require('connect-mongo');

let PORT = process.env.PORT || 3000;

// DataBase Connection; 
const url = "mongodb://localhost:27017/pizza";
mongoose.connect(url).then( ()=> console.log("connection successfull....")).catch((err) => console.log(err));
const connection = mongoose.connection;


//session Config env
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store:  MongoDbStore.create({
        mongoUrl:url,
    }),
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 60 * 60 *24} //24hr
}));

app.use(flash());

//Assets
app.use(express.static('public'))
app.use(express.json())

// Global middleWare
app.use((req,res,next)=>{
    res.locals.session = req.session;
    next();
})

// set Template engine
app.use(expressLayout);
app.set('views' , path.join(__dirname , 'resources' , 'views'));
app.set('view engine' , 'ejs');

// routes
require('./routes/web')(app);


app.listen( PORT , () =>{
    console.log(`listening on port ${PORT}`);
});