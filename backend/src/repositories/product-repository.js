const res = require('express/lib/response');
const mongoose = require('mongoose');
const Product = mongoose.model('Product');

exports.get = async (page = 1, limit = 100) => {
    const skip = (page - 1) * limit;
    const res = await Product.find({})
        .populate('supplier')
        .sort({ title: 1 })
        .skip(skip)  
        .limit(limit); 
    return res;
};

exports.getTotalItems = async () => {
    const count = await Product.countDocuments({});
    return count;
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
  
    console.log(`[REPOSITORY] Buscando produtos para página ${page} com limite ${limit}`);
    console.log(`[REPOSITORY] Skip calculado: ${skip}`);
  
    // Busca os produtos com filtro e paginação
    const products = await Product.find({ title: regex })
      .populate('supplier', 'name')
      .skip(skip)
      .limit(limit)
      .exec();
  
    // Conta o número total de produtos correspondentes
    const total = await Product.countDocuments({ title: regex });
  
    console.log(
      `[REPOSITORY] Encontrados ${products.length} produtos na página ${page}. Total de registros: ${total}`
    );
  
    return { products, total };
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