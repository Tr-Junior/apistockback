const { useColors } = require('debug/src/browser');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment-timezone');

const schema = new Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer'
    },
    number: {
        type: String,
        required: true
    },
    sale: {
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
        discount: {
            type: Number,
            trim: true
        },
        total: {
            type: Number,
            trim: true
        },
        formPayment: {
            type: String,
            trim: true
        }
    },
    createDate: {
        type: Date,
        required: true,
        default: Date.now
    },
});

module.exports = mongoose.model('Order', schema);
