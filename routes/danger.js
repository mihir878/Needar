const express = require('express');
const router = express.Router();
const axios = require('axios');
const mailjet = require('node-mailjet').connect(process.env.mail_variable_a, process.env.mail_variable_b);
const userModel = require('../models/user');

router.get('/', (req, res) => {
     console.log(req.query.lat);
     console.log(req.query.lng);
     console.log(req.query.email);

    let lat = req.query.lat;
    let lng = req.query.lng;
    let email = req.query.email;

    // lat = 26.8467;
    // lng = 80.9462;
    // email = "mihir@gmail.com";
    

    let allEmailAddresses;
    let allPhoneNumbers;
    let allNames;
    let userName;
    let varxx;

    userModel.findOne({
        email: email
    })
        .then((user) => {

            allEmailAddresses = user.relative_email_address;
            allPhoneNumbers = user.relative_phone_numbers;
            allNames = user.relative_names;
            userName = user.name;

            console.log(allEmailAddresses);

            for (let i = 0; i < allEmailAddresses.length; i++) {
                const request = mailjet
                    .post("send", { 'version': 'v3.1' })
                    .request({
                        "Messages": [
                            {
                                "From": {
                                    "Email": "kshitijjaiswal03@gmail.com",
                                    "Name": "Needar"
                                },
                                "To": [
                                    {
                                        "Email": allEmailAddresses[i],
                                        "Name": allNames[i]
                                    }
                                ],
                                "Subject": "Urgent Help",
                                "TextPart": `Please take immediate action in order to help ${userName} at latitude ${lat}, longitude ${lng}`,
                                "HTMLPart": `<h3>Please take immediate action in order to help ${userName} at latitude ${lat}, longitude ${lng}</h3>`,
                                "CustomID": "AppGettingStartedTest"
                            }
                        ]
                    })
                request
                    .then((result) => {
                        console.log(result.body)
                    })
                    .catch((err) => {
                        console.log(err.statusCode)
                    });
            }

            axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=26.8467,80.9462&radius=5500&type=police&key=${process.env.MAP_API_KEY}`)
        .then((response) => {
            let place_id = (response.data.results[0].place_id);

            axios.get(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${place_id}&fields=name,rating,formatted_phone_number&key=${process.env.MAP_API_KEY}`)
                .then((response) => {
                    let phone_number=response.data.result.formatted_phone_number;
                    //commenting this out so that message doesn't reach out to actual police station during testing
                    //allPhoneNumbers.push(phone_number);
                })
                .catch((error) => {
                    console.log(error);
                });
        })
        .catch((error) => {
            console.log(error);
        });
            
            for (let i = 0; i < allPhoneNumbers.length; i++) {
                // require('dotenv').load();
                var twilio = require('twilio')
                var client = new twilio(process.env.accountSid, process.env.authToken);

                client.messages
                    .create({
                        from: 'whatsapp:+14155238886',
                        body: `Please take immediate action in order to help ${userName} at latitude ${lat}, longitude ${lng}`,
                        to: `whatsapp:+91${allPhoneNumbers[i]}`
                    })
                    .then(message => console.log(message.sid))
                    .catch(error => console.log(error));
            }
        })
        .catch((error) => {
            console.log(error);
        });

    res.send("<h1>Alerts send to near by police station & your relatives<h1>");
});

module.exports = router;