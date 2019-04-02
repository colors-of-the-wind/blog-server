const SpeciesModel = require('../models/Species');

const { setLog } = require('./logger');
const { getItem, setItem } = require('../utility/radis');
const { getUser } = require('./user');


/**
 * 查询分类
 * @param  {Object} parame 需要查询的条件，默认查询所有分类
 * @param  {Boolean} multiple 是否查找多个（如果是多个则返回数组， 单个返回对象）默认返回单个
 * @return {Promise}
 */
exports.getSpecies = (parame, multiple = false) => new Promise((resolve, reject) => {
	const find = ({}).toString.call(parame) === '[object Object]' ? multiple ? 'findOne' : 'find' : 'findById';

	SpeciesModel[find](parame, (err, species) => {
		if (err) {
			setLog(err);
			return reject(err, '查询分类失败');
		}

		resolve(species);
	});
});


/**
 * 添加分类
 * @param  {ObjectID} user 创建分类的用户信息
 * @param  {Object} parame 分类信息
 * @return {Promise}
 */
exports.addSpecies = (user, parame={}) => new Promise((resolve, reject) => {
	
	getUser(user).then(user => {
		let newSpecies = new SpeciesModel({...parame, user_id: user._id, createTime: new Date(), delete: 0});
		
		newSpecies.save((err, data) => {
	        if (err) {
	            setLog(err);
	            return reject(err, '添加分类失败');
	        }

	        resolve(null);
	    })
	}).catch((err, msg) => {
		reject(err, '未找到创建分类用户');
	});
});


/**
 * 更新分类
 * @param  {ObjectID} _id 分类_id
 * @param  {Object} parame 修改分类信息
 * @return {Promise}
 */
exports.updateSpecies = (_id, parame={}) => new Promise((resolve, reject) => {
	
	getLabel(_id).then(species => {
 
		if (!species) return reject(species, '未找到匹配分类');

		SpeciesModel.update({_id}, parame, (err, data) => {
	        if (err) {
	            setLog(err);
	            return reject(err, '添加分类失败');
	        }

	        resolve(null);
	    })

	}).catch(err => {
		reject(err, '查询分类失败');
	});
});


/**
 * 删除分类
 * @param  {String} _id  需要删除分类的_id
 * @return {Promise}
 */
exports.deleteSpecies = _id => updateSpecies(_id, { delete: 1 });
