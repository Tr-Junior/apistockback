const { useColors } = require('debug/src/browser');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({

    name: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    roles: [{
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }],
    firstLogin: {
        type: Boolean,
        default: false 
    } 
});



module.exports = mongoose.model('Customer', schema);