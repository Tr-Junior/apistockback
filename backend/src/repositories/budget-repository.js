
const mongoose = require('mongoose');
const Budget = mongoose.model('Budget');

exports.get = async (data) => {
    var res = await Budget.find({})
    return res;
}

exports.create = async (data) => {
    var budget = new Budget(data)
    await budget.save();
}

exports.updateClientName = async (id, data) => {
    await Budget.findByIdAndUpdate(id, {
        $set: {
            client: data.client
        }
    });
}

// Excluir um item do orçamento
exports.removeItemQuantityFromBudget = async (id, itemId, quantityToRemove) => {
    try {
        // Encontra o orçamento pelo ID
        const budget = await Budget.findById(id);

        if (!budget) {
            throw new Error('Orçamento não encontrado');
        }

        // Encontra o item dentro do orçamento
        const item = budget.budget.items.id(itemId);

        if (!item) {
            throw new Error('Item não encontrado no orçamento');
        }

        // Se a quantidade do item for menor ou igual à quantidade a ser removida, remova o item inteiro
        if (item.quantity <= quantityToRemove) {
            item.remove();
        } else {
            // Caso contrário, subtraia a quantidade especificada
            item.quantity -= quantityToRemove;
        }

        // Salva o orçamento atualizado
        const updatedBudget = await budget.save();
        return updatedBudget;
    } catch (error) {
        throw new Error(`Erro ao remover a quantidade do item no orçamento: ${error.message}`);
    }
};


exports.delete = async (id) => {
    await Budget.findByIdAndDelete(id);
}
