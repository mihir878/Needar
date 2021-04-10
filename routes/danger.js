const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/',(req,res)=>{
    console.log(req.query.lat);
    console.log(req.query.lng);
    

        axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=26.8467,80.9462&radius=5500&type=police&key=AIzaSyBLbiU5SOFIG6yL-ePBkjzCakY7j0TwxpU`)
            .then((response)=>{
                let place_id = (response.data.results[0].place_id);

                axios.get(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${place_id}&fields=name,rating,formatted_phone_number&key=AIzaSyBLbiU5SOFIG6yL-ePBkjzCakY7j0TwxpU`)
                    .then((response)=>{
                        console.log(response.data.result.formatted_phone_number);
                    })
                    .catch((error)=>{
                        console.log(error);
                    });
            })
            .catch((error)=>{
                console.log(error);
            });

        res.send("WE are nearly done");
    });

module.exports = router;