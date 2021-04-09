const express = require('express');
const app = express();
const router = express.Router();
const passport = require('passport');

router.get('/',(req,res)=>{
    res.render('login.ejs');
});

router.post('/',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/dashboard',
        failureRedirect:'/login',
        failureFlash: true
    })(req,res,next);
});

module.exports = router;
