const express  = require('express');
const router = express.Router();

router.get('/',(req,res)=>{
    req.logOut();
    req.flash('success_msg','You are logged out');
    res.redirect('/login');
});

module.exports = router;