const mongoose = require('mongoose');
const Schema = require('./db');

const ArticleSchema = new Schema({
	// 文章标题
	title: {type: String, required: true},
	// 摘要图
	figure: {type: String, required: true},
	// 摘要
	abstract: {type: String, required: true},
	// 文章内容
	content: {type: String, required: true},
	// 创建时间
	createTime: {type: Date, required: true},
	// 修改时间
	modifyTime: {type: Date, required: true},
	// 存放地 => 0: 发布列表 1: 草稿列表
	draft: {type: Number, required: true},
	// 是否删除 => 0: 未删除 1: 已删除
	delete: {type: Number, required: true},
	// 是否置顶 => 0: 未置顶 1: 置顶
	top: {type: Number, required: true},
	// 访问量
	views: {type: Number, required: true},
	// 点赞数
	like: {type: Number, required: true},
	// 出处 => 0: 原创 1: 转载
	source: {type: Number, required: true},
	// 创建者id
	user_id: {type: Schema.Types.ObjectId, required: true},
	// 标签id
	label_id: {type: Schema.Types.ObjectId, required: true},
	// 分类id
	species_id: {type: Schema.Types.ObjectId, required: true}
});

const ArticleModel = mongoose.model('Article', AccountSchema, 'Article');

module.exports = ArticleModel;