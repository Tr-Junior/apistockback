
const mongoose = require('mongoose');
const Order = mongoose.model('Order');

exports.get = async (data) => {
    let res = await Order.find({}, 'number createDate customer sale')
        .populate('customer', 'name')
        .populate('sale');
    return res;
}

exports.getSalesByDateRange = async (startDate, endDate) => {
    const query = {};

    if (startDate && !endDate) {
        // Se apenas startDate é fornecido, buscamos todas as vendas daquele dia
        const start = new Date(startDate);
        const end = new Date(startDate);
        end.setDate(end.getDate() + 1); // Adiciona um dia ao endDate para incluir todas as vendas até o fim do dia

        query.createDate = { $gte: start, $lt: end };
    } else if (startDate && endDate) {
        // Se ambos startDate e endDate são fornecidos
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setDate(end.getDate() + 1); // Adiciona um dia ao endDate para incluir todas as vendas até o fim do dia

        query.createDate = { $gte: start, $lt: end };
    } else {
        // Se nenhuma data é fornecida, buscamos as vendas do dia atual
        const today = new Date();
        const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

        query.createDate = { $gte: start, $lt: end };
    }

    // Ordena os resultados pela data de criação em ordem decrescente
    const res = await Order.find(query, 'number createDate customer sale')
        .populate('customer', 'name')
        .populate('sale')
        .sort({ createDate: -1 }); // -1 para ordem decrescente (últimas vendas primeiro)
    
    return res;
}


exports.create = async (data) => {
    let order = new Order(data)
    await order.save();
}

exports.delete = async (id) => {
    await Order.findByIdAndDelete(id);
}

exports.deleteByCode = async (code) => {
    await Order.findOneAndDelete({ number: code });
}