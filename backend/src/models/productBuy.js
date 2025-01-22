const { useColors } = require('debug/src/browser');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
});


module.exports = mongoose.model('ProductBuy', schema);