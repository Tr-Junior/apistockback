const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const supplierSchema = new Schema({
    name: {
        type: String,
        trim: true,
        unique: true
    },
});

module.exports = mongoose.model('Supplier', supplierSchema);
