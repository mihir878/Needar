const express = require('express');
const router = express.Router();
const {ensureAuthentication} = require('../config/auth');

router.get('/',ensureAuthentication,(req,res)=>{
    //console.log(req.user);
    res.render('dashboard',{
        user : req.user
    })
});

module.exports = router;