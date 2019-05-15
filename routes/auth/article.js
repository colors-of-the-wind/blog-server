const express = require('express');
const router = express.Router();

const { error, success } = require('../../utils/result');

const { addArticle, getCount } = require('../../proxy/article');

// 添加文章
router.post('/add', (req, res) => {
	const {title, figure, abstract, content, draft, source, label_id, species_id} = req.body;

	try {
		if (!title) throw '文章标题不能为空';
		if (!figure) throw '文章摘要图不能为空';
		if (!abstract) throw '文章简介不能为空';
		if (!content) throw '文章内容不能为空';
		if (!draft) throw '文章是否发布为必填项';
		if (!source) throw '文章出处为必填项';
		if (!label_id) throw '文章所属标签为必填项';
		if (!species_id) throw '文章所属分类为必填项';
	} catch(msg) {
		error(res, Error(msg), msg);
		return false;
	}

	const options = { title, figure, abstract, content, draft, source, label_id, species_id, user_id: req.userInfo._id }

	addArticle(req.userInfo._id, options)
	.then(() => success(res, null))
	.catch(({err, msg}) => error(res, err, msg));
});


// 更新标签
router.put('/upload', (req, res) => {
	res.end()
});


// 删除标签
router.delete('/del', (req, res) => {
	res.end()
});

module.exports = router;
