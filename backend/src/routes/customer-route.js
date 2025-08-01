const express = require('express');
const router = express.Router();
const controller = require('../controllers/customer-controller');
const authService = require('../services/auth-service');
const customerMiddleware = require('../middlewares/customer-middleware');

router.post('/', authService.isAdmin, customerMiddleware.validateCustomerData, controller.post);
router.get('/', authService.isAdmin, controller.get);
router.get('/check-username/:name', authService.isAdmin, controller.getByName);

router.post('/authenticate', controller.authenticate);
router.post('/refresh-token', authService.authorize, controller.refreshToken);
router.get('/getById/:id', authService.authorize, controller.getById);
router.put('/update-password', authService.authorize, controller.updatePassword);
router.post('/validate-password',authService.authorize, controller.validatePassword);
router.delete('/delete-user/:id',authService.isAdmin, controller.deleteUser)

router.post('/update-admin', authService.isAdmin, controller.updateAdminCredentials);

module.exports = router;
