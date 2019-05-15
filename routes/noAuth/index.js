const express = require('express');
const router = express.Router();

const users = require('./users');
const labels = require('./labels');
const article = require('./article');

const globals = require('./global');


router.use('/global', globals);
router.use('/user', users);
router.use('/label', labels);
router.use('/article', article);

module.exports = router;
