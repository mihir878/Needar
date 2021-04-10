const express = require('express');
const app = express();
const port = process.env.PORT||8000;
const router = require('./routes/index');
const expressLayout = require('express-ejs-layouts');
const flash = require('connect-flash');
const passport = require('passport');
const session = require('express-session');
const mongoose = require('mongoose');

require('./config/passport');

require('dotenv').config();

//Mongo DB connect
mongoose.connect('mongodb://127.0.0.1:27017/hack36',{useNewUrlParser:true,useUnifiedTopology:true})
    .then(()=>console.log("Mongodb Connected"))
    .catch((err)=>console.log(err));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }));

//global variables
app.use(flash());
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//passsport initialization
app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({extended:false}));
app.use(express.json());
//for all static files
app.use(express.static('public'));

//ejs as view (temprary)
//app.use(expressLayout);
app.set('view engine','ejs');

//for routing paths
app.use('/',router);

app.listen(port,()=>{
    console.log(`Server is running at port ${port}`);
})