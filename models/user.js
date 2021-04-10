const mongoose = require('mongoose');

const UserSchema =new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    phone_number:{
        type: Number,
        default: 0000000000,
    },
    relative_phone_numbers:{
        type: Array,
        default: [],
    },
    relative_email_address:{
        type: Array,
        default: [],
    }
}); 

module.exports = new mongoose.model('User',UserSchema);