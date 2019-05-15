const { setLog } = require('../proxy/logger');
// 成功状态码
const SUCCESS_CODE = 0;
// 失败状态码
const ERR_CODE = 1;
// 鉴权失败状态码
const AUTH_CODE = 443;


/**
 * 操作数据库失败返回值模板
 * @param  {Reponse} res Reponse对象
 * @param  {Error} err Error对象
 */
exports.error = (res, err, massage = '服务器错误请稍后再试') => {
	err && setLog(err);
	res.json({
		code: ERR_CODE,
		massage,
		data: null
	});
}


/**
 * 操作成功返回数据模板
 * @param  {Reponse} res Reponse对象
 * @param  {Object} data 返回数据对象
 */
exports.success = (res, data={}) => res.json({
	code: SUCCESS_CODE,
	massage: '全部成功',
	data
});


/**
 * 用户鉴权失败返回模板
 * @param  {Reponse} res Reponse对象
 */
exports.auth = res => res.json({
	code: AUTH_CODE,
	massage: '登陆状态已失效请重新登陆',
	data: {}
});
