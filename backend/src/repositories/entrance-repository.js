const res = require('express/lib/response');
const mongoose = require('mongoose');
const Entrance = mongoose.model('Entrance');

exports.create = async (data) => {
    var entrance = new Entrance(data)
    await entrance.save();
}

exports.get = async () => {
    const res = await Entrance
        .find({});
    return res;
}

exports.delete = async (id) => {
    await Entrance.findByIdAndDelete(id);
}

exports.deleteByCode = async (code) => {
    await Entrance.findOneAndDelete({ numberOfOrder: code });
}