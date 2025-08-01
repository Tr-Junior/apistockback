const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    codigo: {
        type: String,
        required: true,
        trim: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    quantity: {
        type: Number,
        required: true,
        trim: true
    },
    min_quantity: {
        type: Number,
        trim: true
    },
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier',  // Refere-se ao modelo Supplier
        required: false
    },
    purchasePrice: {
        type: Number,
        trim: true
    },
    price: {
        type: Number,
        trim: true,
        required: true,
    },
});

module.exports = mongoose.model('Product', productSchema);
