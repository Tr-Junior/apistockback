const express = require("express");
const { consultarCep } = require("../controllers/cep-controller");

const router = express.Router();

router.post("/cep", consultarCep);

module.exports = router;
