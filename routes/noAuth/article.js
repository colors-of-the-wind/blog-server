const express = require('express');
const router = express.Router();

const { error, success } = require('../../utils/result');
const { getUser } = require('../../proxy/user');

const { getArticle, getCount } = require('../../proxy/article');
const { getLabel } = require('../../proxy/Label');



// 获取全部标签
const getList = (req, res, callback) => {
	let result = [];

	getArticle({delete: 0, top: 0, draft: 0}, true, null, {sort: {modifyTime: 1}})
	.then(data => {
		getCount({delete: 0, top: 0, draft: 0})
		.then(count => {
			const getUsers = data.map(item => getUser(item.user_id))

			Promise.all(getUsers)
			.then(users => {
				const getLabels = data.map(item => getLabel(item.label_id))
				
				Promise.all(getLabels)
				.then(labels => {

					const newResult = data.map((item, index) => {
						const { _id, title, figure, abstract, source, modifyTime, views, like } = item
						const {username, avatar} = users[index];
						const {labelName} = labels[index];

						return {_id, title, figure, abstract, source, modifyTime, views, like, username, avatar, labelName}
					});
					callback({
						list: newResult,
						count: count
					});
				})
				.catch(({err, msg}) => error(res, err, '查询标签信息失败'));
			})
			.catch(({err, msg}) => error(res, err, '查询用户信息失败'));
		})
		.catch(({err, msg}) => error(res, err, '查询文章总条数失败'));
	})
	.catch(({err, msg}) => error(res, err, '获取文章失败'));
}

// 文章列表
router.get('/list', (req, res) => {
	console.log('返回值', req.body)
	getList(req, res, (result) => success(res, result))
});


// 热门文章（前12个）
router.get('/hot', (req, res) => {
	getList(req, res, (result) => success(res, result.list(0, 12)))
});


// 分页查询标签详情
router.get('/details', (req, res) => {
	res.end()
});

module.exports = router;
