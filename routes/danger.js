const express = require('express');
const router = express.Router();

router.get('/',(req,res)=>{
    console.log(req.query.lat);
    console.log(req.query.lng);
    res.send("well done boys");
})

module.exports = router;