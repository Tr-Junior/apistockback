const ValidationContract = require('../validators/validators');
const repository = require('../repositories/order-repository');
const entrance = require('../repositories/entrance-repository');
const product = require('../repositories/product-repository');
const guid = require('guid');
const authService = require('../services/auth-service');
const Product = require('../models/product');
const Order = require('../models/order');
const mongoose = require('mongoose');

// Obtém todas as vendas
exports.get = async (req, res, next) => {
    try {
        const data = await repository.get();
        res.status(200).send(data);
    } catch (e) {
        console.error('Erro ao obter vendas:', e.message);
        res.status(500).send({
            message: 'Falha ao processar a requisição',
            error: e.message
        });
    }
};

// Obtém vendas por intervalo de datas
exports.getSales = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.body; 
        const sales = await repository.getSalesByDateRange(startDate, endDate);
        res.status(200).send(sales);
    } catch (e) {
        console.error('Erro ao obter vendas por intervalo:', e.message);
        res.status(500).send({
            message: 'Falha ao processar a requisição',
            error: e.message
        });
    }
};

// Criação de venda

exports.post = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
  
    try {
      const token = req.body.token || req.query.token || req.headers['x-access-token'];
      const data = await authService.decodeToken(token);
  
      if (!data || !data._id) {
        throw new Error('Token inválido ou usuário não autenticado.');
      }
  
      const number = guid.raw().substring(0, 6);
  
      // Validação de estoque
      for (const item of req.body.sale.items) {
        const productData = await product.getById(item.product);
        if (productData.quantity < item.quantity) {
          throw new Error(`Estoque insuficiente para o produto: ${productData.name}. Disponível: ${productData.quantity}`);
        }
      }
  
      // Criação da venda
      await repository.create({
        customer: req.body.customer,
        number: number,
        sale: req.body.sale,
      }, { session });
  
      // Registro da entrada financeira
      await entrance.create({
        numberOfOrder: number,
        value: req.body.sale.total,
      }, { session });
  
      // Atualização do estoque
      for (const item of req.body.sale.items) {
        await Product.findByIdAndUpdate(
          item.product,
          { $inc: { quantity: -item.quantity } },
          { session }
        );
      }
  
      await session.commitTransaction();
      session.endSession();
  
      res.status(201).send({
        message: 'Venda efetuada com sucesso',
      });
    } catch (e) {
      await session.abortTransaction();
      session.endSession();
      console.error('Erro ao criar venda:', e.stack);
  
      res.status(500).send({
        message: 'Falha ao processar a requisição',
        error: e.message,
      });
    }
  };

// Exclusão de venda por ID
exports.delete = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const order = await Order.findById(req.params.id).populate('sale.items.product');

        if (!order) {
            return res.status(404).send({ message: 'Venda não encontrada' });
        }

        // Atualiza o estoque
        for (const item of order.sale.items) {
            const productId = item.product._id;
            await Product.findByIdAndUpdate(productId, { $inc: { quantity: item.quantity } }, { session });
        }

        // Remove a venda
        await Order.findByIdAndDelete(req.params.id, { session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).send({
            message: 'Venda deletada com sucesso'
        });
    } catch (e) {
        await session.abortTransaction();
        session.endSession();
        console.error('Erro ao deletar venda:', e.message);
        res.status(500).send({
            message: 'Falha ao processar a requisição',
            error: e.message
        });
    }
};

// Exclusão de venda por código
exports.deleteByCode = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const order = await Order.findOne({ number: req.params.code }).populate('sale.items.product');

        if (!order) {
            return res.status(404).send({ message: 'Venda não encontrada' });
        }

        // Atualiza o estoque
        for (const item of order.sale.items) {
            const productId = item.product._id;
            await Product.findByIdAndUpdate(productId, { $inc: { quantity: item.quantity } }, { session });
        }

        // Remove a venda
        await Order.findOneAndDelete({ number: req.params.code }, { session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).send({
            message: 'Venda deletada com sucesso'
        });
    } catch (e) {
        await session.abortTransaction();
        session.endSession();
        console.error('Erro ao deletar venda por código:', e.message);
        res.status(500).send({
            message: 'Falha ao processar a requisição',
            error: e.message
        });
    }
};
