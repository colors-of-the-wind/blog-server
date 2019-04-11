const express = require('express');
const router = express.Router();

const { error, success } = require('../../utils/result');
const { isEmail, isPwd } = require('../../utils/validation');
const { toSaltMd5, defaultPwd } = require('../../utils/secret');
const { getUser, addUser, setToken } = require('../../proxy/user');

const { getBlogInfo } = require('../../proxy/basic');

// 普通用户注册接口
router.post('/register', (req, res) => {
	const { username, password } = req.body;

	getUser({username}).then((user) => {
		try {
			if (user) throw '用户已存在';

			if (!isEmail(username)) throw '用户名格式不正确';

			if (!isPwd(password)) throw '密码格式不正确';
			
		} catch(msg) {
			return error(res, null, msg);
		}
		
		addUser({
			...req.body,
			freeze: 0,
			role: 2,
			createTime: new Date(),
			modifyTime: new Date(),
			avatar: ''
		}).then(() => {
			success(res);
		})
		.catch((err, msg) => {
			error(res, err);
		});
	}).catch((err, msg) => {
		error(res, err);
	});
});

// 用户登陆接口
router.post('/login', (req, res) => {
	const { username, password } = req.body;
	
	try {
		if (!isEmail(username)) throw '用户名或密码错误';

		if (!password) throw '密码不能为空';

	} catch(msg) {
		return error(res, null, msg);
	}

	getUser({username}).then((user) => {
		if (!user) return success(res, { msg: '用户名不存在' });

		const { username, createTime, avatar } = user;

		if (toSaltMd5(password) !== user.password) return error(res, null, '用户名或密码错误');

		setToken(user).then(({key, token}) => {
			let retult = { username, createTime, avatar, isFirst: false };

			res.cookie('token', token);

			if (user.password === defaultPwd) retult.isFirst = true;

			success(res, retult);
		}).catch((err, msg) => {
			error(res, err);
		});
	})
	.catch((err, msg) => {
		error(res, err);
	});
})

module.exports = router;
