const { useColors } = require('debug/src/browser');
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  numberOfOrder: {
    type: String,
    trim: true
  },

  typeOrder: {
    type: String,
    default: "Venda",
    trim: true
  },

  value: {
    type: Number,
    required: true,
    trim: true
  },
  createDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model('Entrance', schema);
