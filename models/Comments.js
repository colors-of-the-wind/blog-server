const mongoose = require('mongoose');
const Schema = require('./db');

const CommentSchema = new Schema({
    // 文章id
    article_id: {type: Schema.Types.ObjectId, required: true},
    // 评论内容
    content: {type: String, required: true},
    // 被评论者id
	parent_id: {type: Schema.Types.ObjectId, required: true},
    // 评论者id
    user_id: {type: Schema.Types.ObjectId, required: true},
    // 评论时间
    createTime: {type: Date, required: true},
});

const CommentSchema = mongoose.model('Comment', CommentSchema, 'Comment');

module.exports = CommentSchema;