const { useColors } = require('debug/src/browser');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment-timezone');

const schema = new Schema({
    client: {
        type: String,
        required: true
    },
    number: {
        type: String,
        required: true
    },
    budget: {
        items: [{
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            title: {
                type: String,
                trim: true
            },
            quantity: {
                type: Number,
                required: true,
                trim: true
            },
            price: {
                type: Number,
                required: true,
                trim: true
            },
        }],
        total: {
            type: Number,
            trim: true
        },
    },
    createDate: {
        type: Date,
        required: true,
        default: Date.now
    },
});

module.exports = mongoose.model('Budget', schema);
