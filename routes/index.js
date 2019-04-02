const express = require('express');
const router = express.Router();


const users = require('./users')
const { getToken } = require('../proxy/user');
const { auth } = require('../utils/result');



router.use('/user', users);

// 放置不需要鉴权的路由

router.use('/', (req, res, next) => {
	const token = req.cookies.token

	getToken(token).then((user) => {
		// 鉴权成功
		res.userInfo = user;
		next();
	})
	.catch(() => {
		// 鉴权失败
		auth(res);
	});
});

// 放置需要鉴权的路由


module.exports = router;
