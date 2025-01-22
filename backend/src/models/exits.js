const { useColors } = require('debug/src/browser');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({

    description: {
        type: String,
        required: true,
        trim: true,
    },

    value: {
        type: Number,
        trim: true
    },

    formPaymentExit: {
        type: String,
        trim: true
    },

    date: {
        type: Date,
        required: true,
        default: Date.now,
        trim: true
    },
});



module.exports = mongoose.model('Exits', schema);