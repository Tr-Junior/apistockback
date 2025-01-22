const res = require('express/lib/response');
const mongoose = require('mongoose');
const Supplier = mongoose.model('Supplier');

exports.get = async () => {
    const res = await Supplier.find({}).sort({ title: 1 });
    return res;
};


exports.delete = async (id) => {
    await Supplier.findByIdAndDelete(id);
}