const express = require('express');
const app = express();
const router = express.Router();
const userModel = require('../models/user');

router.get('/',(req,res)=>{
    res.render('register');
})

router.post('/',(req,res)=>{
    const {name,email,phone_number,password,password2} = req.body;
    let errors = [];

    //check all requirements
    if(!name||!email||!password||!password2)
    errors.push({msg:"Please fill all the feilds."});

    //check password
    if(password!=password2){
        errors.push({msg : 'password does not match'});
    }

    //check password length
    if(password.length<6){
        errors.push({msg:'password length must be at least 6'});
    }

    if(errors.length > 0)
        {
            res.render('register',{
                errors,
                name,
                email,
                phone_number,
                password,
                password2
            });
        }
    else
        {
            userModel.findOne({
                email: email
            })
            .then((user)=>{
                if(user)
                    {
                        errors.push({msg:'Email is already registered'});
                        res.render('register',{
                            errors,
                            name,
                            email,
                            phone_number,
                            password,
                            password2
                        });
                    }
                else
                    {
                        let newUser = new userModel({
                            name,
                            email,
                            password,
                            phone_number,
                        });
                        newUser.save()
                            .then((user)=>{
                                console.log(user);
                                req.flash('success_msg','You are now registered');
                                res.redirect('./login');
                            })
                            .catch((error)=>{
                                console.log(error);
                            });
                    }
            })
        }

    

});

module.exports = router;
