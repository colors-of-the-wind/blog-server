const ArticleSchema = require('../models/Article');

const { setLog } = require('./logger');
const { getUser } = require('./user');


/**
 * 获取文章数
 * @param params 参数对象
 */
exports.getCount = params => new Promise((resolve, reject) =>{
    ArticleSchema.countDocuments(params, (err, count) => {
        if (err) {
			setLog(err);
			return reject({err, msg: '查询文章条数失败'});
		}
        
        return resolve(count);
    });
});

/**
 * 查询文章
 * @param  {Object} parame 需要查询的条件，默认查询所有文章
 * @param  {Boolean} multiple 是否查找多个（如果是多个则返回数组， 单个返回对象）默认返回单个
 * @param  {Object} filter 设置需要过滤的属性 1为显示 0为隐藏
 * @return {Promise}
 */
const getArticle = (parame, multiple = false, filter={}, sort=null) => new Promise((resolve, reject) => {
	const find = ({}).toString.call(parame) === '[object Object]' ? multiple ? 'find' : 'findOne' : 'findById';

	ArticleSchema[find](parame, filter, (err, article) => {
		if (err) {
			setLog(err);
			return reject({err, msg: '查询文章失败'});
		}

		resolve(article);
	});
});

exports.getArticle = getArticle;

/**
 * 添加文章
 * @param  {ObjectID} user 创建文章用户信息
 * @param  {Object} parame 文章信息
 * @return {Promise}
 */
exports.addArticle = (userId, parame={}) => new Promise((resolve, reject) => {
	getUser(userId).then(user => {
		let newArticle = new ArticleSchema({
			...parame,
			user_id: user._id,
			createTime: new Date(),
			modifyTime: new Date(),
			delete: 0,
			top: 0,
			views: 0,
			like: 0
		});

		newArticle.save((err, data) => {
	        if (err) {
	            setLog(err);
	            return reject({err, msg: '添加文章失败'});
	        }

	        resolve(null);
	    });
	})
	.catch((err, msg) => reject({err, msg: '未找到创建文章用户'}));
});


/**
 * 更新文章
 * @param  {ObjectID} _id 文章_id
 * @param  {Object} parame 修改文章信息
 * @return {Promise}
 */
const updateArticle = (_id, parame={}) => new Promise((resolve, reject) => {
	
	getArticle(_id).then(article => {
 
		if (!article) return reject({err, msg: '未找到匹配文章'});

		ArticleSchema.update({_id}, parame, (err, data) => {
	        if (err) {
	            setLog(err);
	            return reject({err, msg: '更新文章失败'});
	        }

	        resolve(null);
	    });
	}).catch(err => {
		reject({err, msg: '查询文章失败'});
	});
});

exports.updateArticle = updateArticle;

/**
 * 置顶文章
 * @param  {String} _id  需要置顶文章的_id
 * @return {Promise}
 */
exports.topArticle = _id => updateArticle(_id, { top: 1 });


/**
 * 删除文章
 * @param  {String} _id  需要删除文章的_id
 * @return {Promise}
 */
exports.deleteArticle = _id => updateArticle(_id, { delete: 1 });


