const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const router = express.Router();
const cors = require('cors');
require("dotenv").config();
const errorMiddleware = require("./middlewares/errorMiddleware");
const path = require('path');
const fs = require('fs');
const validatePathMiddleware = require("./middlewares/validatePathMiddleware");


mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

const corsOptions = {
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'x-access-token'], 
};

app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'dist')));

// Importação de Modelos
const Product = require('./models/product');
const Customer = require('./models/customer');
const Order = require('./models/order');
const Entrance = require('./models/entrance');
const Exits = require('./models/exits');
const Budget = require('./models/budget');
const ProductBuy = require('./models/productBuy');
const Supplier = require('./models/supplier');
const CompanyInfo = require('./models/companyInfo');
const Image = require('./models/image');

// Importação de Rotas
const indexRoute = require('./routes/index-route');
const productRoute = require('./routes/product-route');
const customerRoute = require('./routes/customer-route');
const orderRoute = require('./routes/order-routes');
const entranceRoute = require('./routes/entrance-route');
const exitRoute = require('./routes/exits-route');
const budgetRoute = require('./routes/budget-route');
const productBuyRoute = require('./routes/productBuy-route');
const supplierRoute = require('./routes/supplier-route');
const cepRoute = require('./routes/cep-route');
const companyInfoRoute = require("./routes/companyinfo-route");
const imageRoute = require("./routes/image-route");

// Middleware de validação de caminhos
app.use(validatePathMiddleware);

// Aplicando Rotas
app.use('/', indexRoute);
app.use('/products', productRoute);
app.use('/customers', customerRoute);
app.use('/orders', orderRoute);
app.use('/entrance', entranceRoute);
app.use('/exits', exitRoute);
app.use('/budget', budgetRoute);
app.use('/productBuy', productBuyRoute);
app.use('/supplier', supplierRoute);
app.use('/companyInfo', companyInfoRoute);
app.use('/image', imageRoute);
app.use("/api", cepRoute);

// Middleware de Erro
app.use(errorMiddleware);

// Servir arquivos estáticos da pasta 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rota para SPA (Single Page Application)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

module.exports = app;
