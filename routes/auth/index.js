const express = require('express');
const router = express.Router();

const labels = require('./labels');
const article = require('./article');


router.use('/label', labels);
router.use('/article', article);

module.exports = router;
