const res = require('express/lib/response');
const mongoose = require('mongoose');
const ProductBuy = mongoose.model('ProductBuy');

exports.get = async () => {
    const res = await ProductBuy.find({}).sort({ status: 1 }); // Ordenação alfabética pelo campo 'name'
    return res;
};


exports.getBySlug = async (slug) => {
    const res = await ProductBuy
        .findOne({
            slug: slug,
            active: true
        }, 'title description price slug tags');
    return res;
}

exports.getById = async (id) => {
    const res = await ProductBuy
        .findById(id);
    return res;
}

exports.getByTitle = async (title) => {
    const res = await ProductBuy
        .find({ title: { $regex: title, $options: 'i' } }
        ).limit(25);
    return res;
};



exports.create = async (data) => {
    try {
        const product = new ProductBuy(data);
        await product.save();
        return product;
    } catch (error) {
        console.error('Erro ao criar o produto:', error);
        throw error;
    }
}

exports.findByTitle = async (title) => {
    try {
        return await ProductBuy.findOne({ title: title });
    } catch (error) {
        console.error('Erro ao buscar produto por título:', error);
        throw error;
    }
}

exports.update = async (id, data) => {
    try {
        const result = await ProductBuy.findByIdAndUpdate(id, {
            $set: {
                title: data.title,
                status: data.status
            }
        }, { new: true });  // new: true retorna o documento atualizado

        return result;
    } catch (error) {
        console.error('Erro ao atualizar o produto:', error);
        throw error;
    }
}


exports.delete = async (id) => {
    await ProductBuy.findByIdAndDelete(id);
}