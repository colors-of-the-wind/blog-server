const express = require('express');
const router = express.Router();

const { error, success } = require('../../utils/result');
const { isEmail, isPwd } = require('../../utils/validation');
const { toSaltMd5, defaultPwd } = require('../../utils/secret');
const { getUser, addUser, setToken } = require('../../proxy/user');

const { addLabel, getLabel, updateLabel, deleteLabel } = require('../../proxy/Label');

// 添加标签
router.post('/add', (req, res) => {
	const { labelName, icon } = req.body;

	if (!labelName || !icon) return error(res, Error('添加标签参数不正确', req.body), '添加标签参数不正确');

	getLabel({labelName})
	.then(label => {
		if (!!label) return error(res, Error('标签已存在'), '标签已存在');

		addLabel(req.userInfo._id, {labelName, icon})
		.then(data => success(res, data))
		.catch(({err, msg}) => error(res, err, msg));
	})
	.catch(({err, msg}) => error(res, err, msg));
});


// 更新标签
router.put('/upload', (req, res) => {
	const { labelName, icon, _id } = req.body;

	if (!labelName && !icon) return error(res, Error('参数错误'), '参数错误')

	let options = {};

	if (!!labelName) options['labelName'] = labelName;

	if (!!icon) options['icon'] = icon;

	updateLabel(_id, options)
	.then(data => success(res, data))
	.catch(({err, msg}) => error(res, err, msg));
});


// 删除标签
router.delete('/del', (req, res) => {
	const _id = req.query._id;

	if (!_id) return error(res, Error('参数错误'), '参数错误')

	deleteLabel(_id)
	.then(data => success(res, data))
	.catch(({err, msg}) => {
		console.log(err, msg)
		error(res, err, msg)
	});
});

module.exports = router;
