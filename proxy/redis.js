const client = require('../utility/radis')
const { enable, defaultExpired } = require('../config.json').redis;
const { setLog } = require('./logger');

/**
 * 设置缓存
 * @param key 缓存key
 * @param value 缓存value
 * @param expired 缓存的有效时长，单位秒
 */
exports.setItem = (key, value, callback, type='json', expired = defaultExpired) => new Promise((resolve, reject) => {
    if (!enable) return callback(null);

    let newValue = value;
    if (type === 'json') newValue = JSON.stringify(value);

    client.set(key, newValue, (err) => {
        if (err) {
            setLog(err);
            return callback(err);
        }

        if (expired) client.expire(key, expired);

        return callback(null);
    });
})


/**
 * 获取缓存
 * @param key 缓存key
 */
exports.getItem = (key, callback, type='json') => {
    if (!enable) return callback(null, null);

    client.get(key, function (err, reply) {
        if (err) {
            setLog(err);
            return callback(err);
        }

        let newValue = reply;

        if (type === 'json') newValue = JSON.parse(reply);

        return callback(null, newValue);
    });
}


/**
 * 移除缓存
 * @param key 缓存key
 */
exports.removeItem = (key, callback) => {
    if (!enable) return callback(null);

    client.del(key, function (err) {
        if (err) {
            setLog(err);
            return callback(err);
        }
        
        return callback(null);
    });
}