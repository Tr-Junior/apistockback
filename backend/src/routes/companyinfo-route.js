const express = require("express");
const controller = require("../controllers/companyInfo-controller");
const companyInfoMiddleware = require("../middlewares/companyInfo-middleware");
const router = express.Router();
const authService = require('../services/auth-service');


router.post("/company",authService.isAdmin, companyInfoMiddleware.validateCompanyInfo, controller.createCompanyInfo);
router.get("/company",authService.isAdmin, controller.getAllCompanyInfo);
router.get("/company/:id",authService.isAdmin, controller.getCompanyInfoById);
router.put("/company/:id",authService.isAdmin, controller.updateCompanyInfo);
router.delete("/company/:id",authService.isAdmin, controller.deleteCompanyInfo);


module.exports = router;

