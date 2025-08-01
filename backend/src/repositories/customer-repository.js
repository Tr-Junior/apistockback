const res = require('express/lib/response');
const mongoose = require('mongoose');
const Customer = mongoose.model('Customer');
const md5 = require('md5');



exports.get = async () => {
    const res = await Customer
        .find({});
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

exports.updateAdminCredentials = async (newName, newPassword) => {
    try {
        const admin = await Customer.findOne({ name: process.env.ADMIN_DEFAULT_USER });

        if (!admin) {
            throw new Error('Admin não encontrado');
        }

        admin.isTemporaryPasswordUsed = true;
        await admin.save();

        const newAdmin = new Customer({
            name: newName,
            password: md5(newPassword + process.env.SALT_KEY),
            roles: ["admin"],
            firstLogin: false
        });

        await newAdmin.save();

        return newAdmin;
    } catch (e) {
        throw new Error('Erro ao criar novo administrador');
    }
};


exports.createDefaultAdmin = async () => {
    const existingAdmin = await Customer.findOne({ name: process.env.ADMIN_DEFAULT_USER });

    if (existingAdmin) {
        throw new Error("Admin já existe.");
    }

    const user = new Customer({
        name: process.env.ADMIN_DEFAULT_USER,
        password: md5(process.env.ADMIN_DEFAULT_PASS + process.env.SALT_KEY),
        roles: ["admin"],
        firstLogin: true
    });

    return await user.save();
};

exports.delete = async (id) => {
    await Customer.findByIdAndDelete(id);
}


