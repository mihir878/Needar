const mailjet = require ('node-mailjet')
.connect('52da71222efb37ab3c6dc49dfb80f898', '475ded784b033f992ec607be597670b2')
const request = mailjet
.post("send", {'version': 'v3.1'})
.request({
  "Messages":[
    {
      "From": {
        "Email": "kshitijjaiswal03@gmail.com",
        "Name": "Needar"
      },
      "To": [
        {
          "Email": "mihirladdha878@gmail.com",
          "Name": "Mihir"
        }
      ],
      "Subject": "Greetings from Mailjet.",
      "TextPart": "My first Mailjet email",
      "HTMLPart": "<h3>Dear passenger 1, welcome to <a href='https://www.mailjet.com/'>Mailjet</a>!</h3><br />May the delivery force be with you!",
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
  })