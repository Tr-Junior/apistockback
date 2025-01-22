const res = require('express/lib/response');
const mongoose = require('mongoose');
const Exits = mongoose.model('Exits');

exports.get = async () => {
    const res = await Exits
        .find({});
    return res;
}

exports.getById = async (id) => {
    const res = await Exits
        .findById(id);
    return res;
}

exports.getByTitle = async (description) => {
    const res = await Exits
        .find({ description: { $regex: description, $options: 'i' } });
    return res;
}

exports.create = async (data) => {
    var exits = new Exits(data)
    await exits.save();
}

exports.update = async (id, data) => {
    await Exits.findByIdAndUpdate(id, {
        $set: {
            description: data.description,
            value: data.value,
            formPaymentExit: data.formPaymentExit,
            date: data.date
        }
    });
}


exports.delete = async (id) => {
    await Exits.findByIdAndDelete(id);
}