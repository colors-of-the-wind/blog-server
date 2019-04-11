const redis = require('redis');
const config = require('../config.json');
const LogModel = require('../models/Log').LogModel;

const { setLog } = require('../proxy/logger');

const redisEnable = config.redis.enable;
const defaultExpired = config.defaultExpired;
let client = null;

if (redisEnable) {
    client = redis.createClient(config.redis.port || 6379, config.redis.host || 'localhost');

    client.on('error', function (err) {
        console.error('Redis连接错误: ' + err);
        process.exit(1);
    });
}

/**
 * 设置缓存
 * @param key 缓存key
 * @param value 缓存value
 * @param expired 缓存的有效时长，单位秒
 */
exports.setItem = (key, value, callback, type='json', expired = defaultExpired) => new Promise((resolve, reject) => {
    if (!redisEnable) return callback(null);

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
    if (!redisEnable) return callback(null, null);

    client.get(key, function (err, reply) {
        if (err) {
            setLog(err);
            return callback(err);
        }

        let newValue = reply;

        if (type === 'json') newValue = JSON.parse(reply);

        console.log('dangqian', type === 'json', newValue, typeof newValue, reply)
        
        return callback(null, newValue);
    });
}


/**
 * 移除缓存
 * @param key 缓存key
 */
exports.removeItem = (key, callback) => {
    if (!redisEnable) return callback(null);

    client.del(key, function (err) {
        if (err) {
            setLog(err);
            return callback(err);
        }
        
        return callback(null);
    });
}