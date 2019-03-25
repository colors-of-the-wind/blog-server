const redis = require('redis');
const config = require('../config');
const redisEnable = config.redis.enable;
const defaultExpired = config.defaultExpired;

if (redisEnable) {
    const client = redis.createClient(config.redis.port || 6379, config.redis.host || 'localhost');

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
exports.setItem = (key, value, expired = defaultExpired) => new Promise((resolve, reject) => {
    if (!redisEnable) return resolve();

    client.set(key, JSON.stringify(value), function (err) {
        if (err) return reject(err);
        if (expired) client.expire(key, expired);

        return resolve();
    });
})


/**
 * 获取缓存
 * @param key 缓存key
 */
exports.getItem = key => new Promise((resolve, reject) => {
    if (!redisEnable) return resolve();

    client.get(key, function (err, reply) {
        if (err) return reject(err);

        return resolve(JSON.parse(reply));
    });
}


/**
 * 移除缓存
 * @param key 缓存key
 */
exports.removeItem = key => new Promise((resolve, reject) => {
    if (!redisEnable) return resolve();

    client.del(key, function (err) {
        if (err) {
            return reject(err);
        }
        
        return resolve();
    });
}