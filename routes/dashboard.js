const express = require('express');
const router = express.Router();
const {ensureAuthentication} = require('../config/auth');

/*if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition((position)=>{
        console.log(position.coords.latitude);
        console.log(position.coords.longitude);
    });
}*/

router.get('/',ensureAuthentication,(req,res)=>{
    res.render('dashboard',{
        name : req.user.name
    })
});

module.exports = router;