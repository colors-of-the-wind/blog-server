const express = require('express');
const router = express.Router();

const { error, success } = require('../../utils/result');
const { getUser } = require('../../proxy/user');
const { paging } = require('../../proxy/article');
const { getLabel } = require('../../proxy/Label');

// 文章列表
router.get('/list', async (req, res) => {
	const { page, pageSize } = req.query
	try {
		const result = await paging({delete: 0, top: 0, draft: 0}, {modifyTime: -1}, {}, page, pageSize)
		const getUsers = result.list.map(item => getUser(item.user_id))
		const getLabels = result.list.map(item => getLabel(item.label_id))
		const users = await Promise.all(getUsers)
		const labels = await Promise.all(getLabels)
		const newList = result.list.map((item, index) => {
			const { _id, title, figure, abstract, source, modifyTime, views, like } = item
			const {nickname, avatar} = users[index];
			const {labelName} = labels[index];

			return {_id, title, figure, abstract, source, modifyTime, views, like, nickname, avatar, labelName}
		})

		success(res, {...result, list: newList})
	} catch (err) {
		error(res, err, '获取文章失败')
	}
});


// 热门文章（前12个）
router.get('/hot', async (req, res) => {
	try {
		const result = await paging({delete: 0, top: 0, draft: 0}, {modifyTime: -1}, {}, 1, 8)
		success(res, result)
	} catch (err) {
		error(res, err, '获取文章失败')
	}
});


// 分页查询标签详情
router.get('/details', (req, res) => {
	res.end()
});

module.exports = router;
