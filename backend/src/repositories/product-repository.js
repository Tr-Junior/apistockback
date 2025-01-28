const res = require('express/lib/response');
const mongoose = require('mongoose');
const Product = mongoose.model('Product');

exports.get = async () => {
    const res = await Product.find({})
        .populate('supplier') // Popula informações do fornecedor
        .sort({ title: 1 });
    return res;
};


exports.getBySlug = async (slug) => {
    const res = await Product
        .findOne({
            slug: slug,
            active: true
        }, 'title description price slug tags');
    return res;
}

exports.getById = async (id) => {
    const res = await Product
        .findById(id);
    return res;
}



exports.getByTitle = async (title, page = 1, limit = 25) => {
    const regex = new RegExp(title, 'i');
    const skip = (page - 1) * limit;

    const products = await Product.find({ title: regex })
        .populate('supplier', 'name')
        .skip(skip)
        .limit(limit)
        .exec();

    const total = await Product.countDocuments({ title: regex });

    return { products, total, page, totalPages: Math.ceil(total / limit) };
};



exports.create = async (data) => {
    var product = new Product(data)
    await product.save();
}

exports.update = async (id, data) => {
    await Product.findByIdAndUpdate(id, {
        $set: {
            title: data.title,
            quantity: data.quantity,
            supplier: data.supplier,
            purchasePrice: data.purchasePrice,
            price: data.price
        }
    });
}


exports.delete = async (id) => {
    await Product.findByIdAndDelete(id);
}