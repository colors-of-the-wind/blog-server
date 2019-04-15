const express = require('express');
const router = express.Router();

const { error, success } = require('../../utils/result');
const { isEmail, isPwd } = require('../../utils/validation');
const { toSaltMd5, defaultPwd } = require('../../utils/secret');
const { getUser, addUser, setToken } = require('../../proxy/user');

const { getBlogInfo } = require('../../proxy/basic');

// 博客基本信息
router.get('/blogInfo', (req, res) => {
	getBlogInfo().then((data) => {
		success(res, data);
	}).catch((err, msg) => {
		error(res, err);
	});
});

module.exports = router;
