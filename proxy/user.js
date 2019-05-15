const jwt = require('jsonwebtoken');

const AccountModel = require('../models/Account');

const { setLog } = require('./logger');
const { getItem, setItem } = require('../utility/radis');
const { toStringId, toObjectId, salt, toSaltMd5 } = require('../utils/secret');


/**
 * 查询用户
 * @param  {Object} parame 需要查询的条件，默认查询所有用户
 * @param  {Boolean} multiple 是否查找多个（如果是多个则返回数组， 单个返回对象）默认返回单个
 * @param  {Object} filter 设置需要过滤的属性 1为显示 0为隐藏
 * @return {Promise}
 */
const getUser = (parame, multiple = false, filter={}) => new Promise((resolve, reject) => {

    const find = ({}).toString.call(parame) === '[object Object]' ? multiple ? 'find' : 'findOne' : 'findById';

    AccountModel[find](parame, filter, (err, data) => {
        if (err) {
            setLog(err);
            return reject({err, msg: '查询用户失败'});
        }

        resolve(data);
    });
});

exports.getUser = getUser;

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
            return reject({err, msg: '添加失败'});
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
const updateUser = (_id, parame={}) => new Promise((resolve, reject) => {

    getUser(_id).then(user => {
        if (!user) return reject({err: user, msg: '未找到匹配用户'});

        AccountModel.update({_id}, parame, (err, data) => {
            if (err) {
                setLog(err);
                return reject({err, msg: '更新失败'});
            }

            resolve(null);
        });
    }).catch(err => {
        reject({err, msg: '查找用户失败'});
    })
});

exports.updateUser = updateUser;


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
        reject({err, msg: 'token签发失败'});
    }

    let key = `token_${id}`;
    
    setItem(key, token, (err, data) => {
        if (err) {
            setLog(err, 1);
            return reject({err, msg: 'token保存失败'});
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
            return reject({err, msg: '解密失败'});
        }

        const _id = toObjectId(user.id);

        let key = `token_${_id}`;

        getItem(key, (err, data) => {
            if (err) {
                setLog(err, 1);
                return reject({err, msg: 'token查询失败'});
            }

            if(!data) return reject({err: null, msg: '未查到相关token'});

            user._id = _id;

            delete user.id;

            resolve(user);

        }, 'text');
    });
});


