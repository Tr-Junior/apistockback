const res = require('express/lib/response');
const mongoose = require('mongoose');
const Customer = mongoose.model('Customer');
const md5 = require('md5');



exports.get = async () => {
    const res = await Customer
        .find({}
        );
    return res;
}

exports.create = async (data) => {
    var customer = new Customer(data)
    await customer.save();
}

exports.authenticate = async (data) => {
    const res = await Customer.findOne({
        name: data.name,
        password: data.password
    });
    return res;
}
exports.checkUsernameExists = async (name) => {
    const regex = new RegExp(`^${name}$`, 'i');
    const exists = await Customer.exists({ name: regex });
    return exists;
};
exports.getById = async (id) => {
    const res = await Customer.findById(id);
    return res;
};

exports.updatePassword = async (id, password) => {
    await Customer.findByIdAndUpdate(id, {
        $set: {
            password: md5(password.password + process.env.SALT_KEY),
            pass: password.pass
        }
    });
}




