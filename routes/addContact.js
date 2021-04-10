const express = require('express');
const router = express.Router();
const userModel = require('../models/user');

router.get('/',(req,res)=>{
    console.log(req.query);
    let userEmail = req.query.useremail;
    let name = req.query.name;
    let email = req.query.email;
    let phone_number = req.query.phone;

    userModel.updateOne(
        {email : userEmail},
        {$push: {relative_names: [name],relative_phone_numbers: [phone_number],relative_email_address: [email]}},
        function(err, result) {
            if (err) {
              console.log(err);
            } else {
              console.log(result);
            }
          }
    );
    //res.send("Okay");
    res.redirect('/dashboard');
})

module.exports = router;