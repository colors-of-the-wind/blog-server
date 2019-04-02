const jwt = require('jsonwebtoken');

const AccountModel = require('../models/Account');

const { setLog } = require('./logger');
const { getItem, setItem } = require('../utility/radis');
const { toStringId, toObjectId, salt, toSaltMd5 } = require('../utils/secret');


/**
 * 查询用户
 * @param  {Object} parame 需要查询的条件，默认查询所有用户
 * @param  {Boolean} multiple 是否查找多个（如果是多个则返回数组， 单个返回对象）默认返回单个
 * @return {Promise}
 */
exports.getUser = (parame, multiple = false) => new Promise((resolve, reject) => {

    const find = ({}).toString.call(parame) === '[object Object]' ? multiple ? 'findOne' : 'find' : 'findById';

    AccountModel[find](parame, (err, data) => {
        if (err) {
            setLog(err);
            return reject(err, '查询用户失败');
        }

        resolve(data);
    });
});

/**
 * 添加用户
 * @param  {Object} parame 用户详细信息
 * @return {Promise}
 */
exports.addUser = (parame={}) => new Promise((resolve, reject) => {

    let newUser = new AccountModel({...parame, password: toSaltMd5(parame.password)});

    newUser.save((err, data) => {
        if (err) {
            setLog(err);
            return reject(err, '添加失败');
        }

        resolve(null);
    })
});


/**
 * 更新用户
 * @param  {String} _id    需要更新数据的_id
 * @param  {Object} parame 需要更新的数据，可以是一个或多个
 * @return {Promise}
 */
exports.updateUser = (_id, parame={}) => new Promise((resolve, reject) => {

    getUser(_id).then(user => {
        if (!user) return reject(user, '未找到匹配用户');

        AccountModel.update({_id}, parame, (err, data) => {
            if (err) {
                setLog(err);
                return reject(err, '更新失败');
            }

            resolve(null);
        });
    }).catch(err => {
        reject(err, '查找用户失败');
    })
});


/**
 * 冻结用户
 * @param  {String} _id    需要冻结用户的_id
 * @return {Promise}
 */
exports.freezeUser = _id => updateUser(_id, { freeze: 1 });


/**
 * 生成token
 * 
 * @param  {String} _id    需要token的用户_id
 * @return {Promise}
 */
exports.setToken = user => new Promise((resolve, reject) => {
    let token = null;

    const { username, _id, freeze, role, avatar } = user;
    const id = toStringId(user._id);

    try {
        token = jwt.sign({ username, id, freeze, role, avatar }, salt);
    } catch(err) {
        setLog(err, 3);
        reject(err, 'token签发失败');
    }

    let key = `token_${id}`;
    
    setItem(key, token, (err, data) => {
        if (err) {
            setLog(err, 1);
            return reject(err, 'token保存失败');
        }

        resolve({ key, token });
    }, 'text', 43200);
});


/**
 * 校验token是否存在或者失效
 * 
 * @param  {String} token 用户携带token
 * @return {Promise}
 */
exports.getToken = token => new Promise((resolve, reject) => {
    jwt.verify(token, salt, (err, user) => {      
        if (err) {
            setLog(err, 3);
            return reject(err, '解密失败');
        }

        const _id = toObjectId(user.id);

        let key = `token_${_id}`;

        getItem(key, (err, data) => {
            if (err) {
                setLog(err, 1);
                return reject(err, 'token查询失败');
            }

            if(!data) return reject(null, '未查到相关token');

            data._id = toObjectId(data.id);

            delete data.id;

            resolve(data);

        }, 'text');
    });
});


