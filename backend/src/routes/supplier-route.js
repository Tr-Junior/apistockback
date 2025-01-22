'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/supplier-controller');
const authService = require('../services/auth-service');

router.get('/', authService.authorize, controller.get);
router.delete('/:id', authService.authorize, controller.delete);


module.exports = router;