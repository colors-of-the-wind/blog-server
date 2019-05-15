const express = require('express');
const router = express.Router();

const { error, success } = require('../../utils/result');
const { getUser, addUser, setToken } = require('../../proxy/user');

const { getLabel } = require('../../proxy/Label');
const { getCount, getArticle } = require('../../proxy/article');



// 获取全部标签
const getList = (req, res, callback) => {
	let result = [];

	getLabel({delete: 0}, true, {labelName: 1, icon: 1, createTime: 1, _id: 1}, {sort: {labelName: 1}})
	.then(data => {
		const options = data.map(item => getCount({label_id: item._id}))

		Promise.all(options)
		.then(result => {
			const newResult = result.map((count, index) => {
				const {labelName, icon, createTime, _id} = data[index];

				return { _id, labelName, icon, createTime, count }
			});
			callback(newResult);
		})
		.catch(({err, msg}) => error(res, err, '查询失败'));
	})
	.catch(({err, msg}) => error(res, err, '获取标签失败'));
}

// 标签列表
router.get('/list', (req, res) => {
	getList(req, res, (result) => success(res, result))
});


// 热门标签（前12个）
router.get('/hot', (req, res) => {
	getList(req, res, (result) => success(res, result.splice(0, 12)))
});


// 分页查询标签详情
router.get('/details', (req, res) => {
	const {_id, size, page} = req.query._id;

	if (!_id || !size || !page) return error(res, Error('参数有误'), '参数有误请检查');

	getArticle({_id}, true, null, {sort: {modifyTime: 1}})
	.then(article => {
		if (!article) return error(res, Error('未找到相关标签'), '查询文章数据失败');

		getCount({label_id: _id})
		.then(count => {
			const result = {
				list: article.splice(page, size),
				count
			}
			success(res, result);
		})
		.catch(({err, msg}) => error(res, err, '查询文章总条数失败'));
	})
	.catch(({err, msg}) => error(res, err, '查询文章数据失败'));
});

module.exports = router;
