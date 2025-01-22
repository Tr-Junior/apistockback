'use strict';

const express = require('express');
const router = express.Router();

router.get('/', (_req, res, next) => {
    res.status(200).send({
        titel: "Wrconexao",
        version: "0.1.0"
    });
});



module.exports = router;







