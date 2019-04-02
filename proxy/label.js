const LabelModel = require('../models/Label');

const { setLog } = require('./logger');
const { getItem, setItem } = require('../utility/radis');
const { getUser } = require('./user');


/**
 * 查询标签
 * @param  {Object} parame 需要查询的条件，默认查询所有标签
 * @param  {Boolean} multiple 是否查找多个（如果是多个则返回数组， 单个返回对象）默认返回单个
 * @return {Promise}
 */
exports.getLabel = (parame, multiple = false) => new Promise((resolve, reject) => {
	const find = ({}).toString.call(parame) === '[object Object]' ? multiple ? 'findOne' : 'find' : 'findById';

	LabelModel[find](parame, (err, labels) => {
		if (err) {
			setLog(err);
			return reject(err, '查询标签失败');
		}

		resolve(labels);
	});
});


/**
 * 添加标签
 * @param  {ObjectID} user 创建标签信息
 * @param  {Object} parame 标签信息
 * @return {Promise}
 */
exports.addLabel = (user, parame={}) => new Promise((resolve, reject) => {
	
	getUser(user).then(user => {
		let newLabel = new LabelModel({...parame, user_id: user._id, createTime: new Date(), delete: 0});
		
		newLabel.save((err, data) => {
	        if (err) {
	            setLog(err);
	            return reject(err, '添加标签失败');
	        }

	        resolve(null);
	    })
	}).catch((err, msg) => {
		reject(err, '未找到创建标签用户');
	});
});


/**
 * 更新标签
 * @param  {ObjectID} _id 标签_id
 * @param  {Object} parame 修改标签信息
 * @return {Promise}
 */
exports.updateLabel = (_id, parame={}) => new Promise((resolve, reject) => {
	
	getLabel(_id).then(label => {
 
		if (!label) return reject(label, '未找到匹配标签');

		LabelModel.update({_id}, parame, (err, data) => {
	        if (err) {
	            setLog(err);
	            return reject(err, '添加标签失败');
	        }

	        resolve(null);
	    })

	}).catch(err => {
		reject(err, '查询标签失败');
	});
});


/**
 * 删除标签
 * @param  {String} _id  需要删除标签的_id
 * @return {Promise}
 */
exports.deleteLabel = _id => updateLabel(_id, { delete: 1 });
