const express = require("express");
const controller = require("../controllers/companyInfo-controller");
const companyInfoMiddleware = require("../middlewares/companyInfo-middleware");
const router = express.Router();


router.post("/company", companyInfoMiddleware.validateCompanyInfo, controller.createCompanyInfo);
router.get("/company", controller.getAllCompanyInfo);
router.get("/company/:id", controller.getCompanyInfoById);
router.put("/company/:id", controller.updateCompanyInfo);
router.delete("/company/:id", controller.deleteCompanyInfo);


module.exports = router;

