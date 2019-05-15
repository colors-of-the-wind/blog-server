const LabelModel = require('../models/Label');

const { setLog } = require('./logger');
const { getUser } = require('./user');
const { getItem, setItem } = require('../utility/radis');


/**
 * 查询标签
 * @param  {Object} parame 需要查询的条件，默认查询所有标签
 * @param  {Boolean} multiple 是否查找多个（如果是多个则返回数组， 单个返回对象）默认返回单个
 * @param  {Object} filter 设置需要过滤的属性 1为显示 0为隐藏
 * @param  {Object} sort 设置排序方式
 * @return {Promise}
 */
const getLabel = (parame={}, multiple=false, filter=null, sort=null) => new Promise((resolve, reject) => {
	const find = ({}).toString.call(parame) === '[object Object]' ? multiple ? 'find' : 'findOne' : 'findById';

	LabelModel[find](parame, filter, sort, (err, labels) => {
		if (err) {
			setLog(err);
			return reject({err, msg: '查询标签失败'});
		}

		resolve(labels);
	})
});

exports.getLabel = getLabel;

/**
 * 添加标签
 * @param  {ObjectID} user 创建标签信息
 * @param  {Object} parame 标签信息
 * @return {Promise}
 */
exports.addLabel = (userId, parame={}) => new Promise((resolve, reject) => {
	
	getUser(userId).then(user => {
		if (!user) return reject({err: user, msg: '未找到匹配用户'});

		let newLabel = new LabelModel({...parame, user_id: user._id, createTime: Date.now(), delete: 0});
		
		newLabel.save((err, data) => {
	        if (err) {
	            setLog(err);
	            return reject({err, msg: '添加标签失败'});
	        }

	        resolve(null);
	    })
	}).catch((err, msg) => {
		setLog(err);
		reject({err, msg: '未找到创建标签用户'});
	});
});


/**
 * 更新标签
 * @param  {ObjectID} _id 标签_id
 * @param  {Object} parame 修改标签信息
 * @return {Promise}
 */
const updateLabel = (_id, parame={}, isDel=false) => new Promise((resolve, reject) => {
	
	getLabel(_id).then(label => {
		
		if (!label || !isDel && label.delete) return reject({err: label, msg: '未找到匹配标签'});

		if (isDel && label.delete) return resolve(null);

		LabelModel.updateOne({_id}, parame, err => {
	        if (err) {
	            setLog(err);
	            return reject({err, msg: '添加标签失败'});
	        }

	        resolve(null);
	    })
	}).catch(err => {
		setLog(err);
		reject({err, msg: '查询标签失败'});
	});
});

exports.updateLabel = updateLabel;


/**
 * 删除标签
 * @param  {String} _id  需要删除标签的_id
 * @return {Promise}
 */
exports.deleteLabel = _id => updateLabel(_id, { labelName: 'shenweikang' }, true);
