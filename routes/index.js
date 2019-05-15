const express = require('express');
const router = express.Router();

const { getToken } = require('../proxy/user');
const { auth } = require('../utils/result');

const authRouters = require('./auth');
const noAuthRouters = require('./noAuth');


router.use('/', noAuthRouters);


// 放置不需要鉴权的路由

router.use('/', (req, res, next) => {
	const token = req.cookies.token

	if (!token) return auth(res);

	getToken(token).then((user) => {
		// 鉴权成功
		req.userInfo = user;
		next();
	})
	.catch(() => {
		// 鉴权失败
		auth(res);
	});
});

// 放置需要鉴权的路由

router.use('/', authRouters);

module.exports = router;
