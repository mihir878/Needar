const express = require('express');
const router = express.Router();
const {ensureAuthentication} = require('../config/auth');

router.use('/login',require('./login'));
router.use('/logout',require('./logout'));
router.use('/register',require('./register'));
router.use('/dashboard',require('./dashboard'));
router.use('/danger',require('./danger'));

router.get('/',(req,res)=>{
    res.render("welcome.ejs");
});

module.exports = router;