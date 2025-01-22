'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/entrance-controller');
const authService = require('../services/auth-service');


router.get('/', authService.isAdmin, controller.get);
router.delete('/:id', authService.isAdmin, controller.delete);
router.delete('/deleteByCode/:code', authService.isAdmin, controller.deleteByCode);


module.exports = router;