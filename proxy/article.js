const ArticleSchema = require('../models/Article');

const { setLog } = require('./logger');
const { getItem, setItem } = require('../utility/radis');
const { getUser } = require('./user');


/**
 * 查询文章
 * @param  {Object} parame 需要查询的条件，默认查询所有文章
 * @param  {Boolean} multiple 是否查找多个（如果是多个则返回数组， 单个返回对象）默认返回单个
 * @return {Promise}
 */
exports.getArticle = (parame, multiple = false) => new Promise((resolve, reject) => {
	const find = ({}).toString.call(parame) === '[object Object]' ? multiple ? 'findOne' : 'find' : 'findById';

	ArticleSchema[find](parame, (err, article) => {
		if (err) {
			setLog(err);
			return reject(err, '查询文章失败');
		}

		resolve(article);
	});
});


/**
 * 添加文章(未完成)
 * @param  {ObjectID} user 创建文章用户信息
 * @param  {Object} parame 文章信息
 * @return {Promise}
 */
exports.addArticle = (user, parame={}) => new Promise((resolve, reject) => {
	
	getUser(user).then(user => {
		let newArticle = new ArticleSchema({...parame, user_id: user._id, createTime: new Date(), delete: 0});
		
		newArticle.save((err, data) => {
	        if (err) {
	            setLog(err);
	            return reject(err, '添加文章失败');
	        }

	        resolve(null);
	    })
	}).catch((err, msg) => {
		reject(err, '未找到创建文章用户');
	});
});


/**
 * 更新文章
 * @param  {ObjectID} _id 文章_id
 * @param  {Object} parame 修改文章信息
 * @return {Promise}
 */
exports.updateArticle = (_id, parame={}) => new Promise((resolve, reject) => {
	
	getArticle(_id).then(article => {
 
		if (!article) return reject(article, '未找到匹配文章');

		ArticleSchema.update({_id}, parame, (err, data) => {
	        if (err) {
	            setLog(err);
	            return reject(err, '更新文章失败');
	        }

	        resolve(null);
	    })

	}).catch(err => {
		reject(err, '查询文章失败');
	});
});


/**
 * 删除文章
 * @param  {String} _id  需要删除文章的_id
 * @return {Promise}
 */
exports.deleteArticle = _id => updateArticle(_id, { delete: 1 });
