const redis = require('redis');
const {enable, host, port} = require('../config.json').redis;

const newHost = host || 'localhost';
const newPort = port || 6379;
const url = `redis:${host}:${newPort}`;

let client = null;

if (enable) {
    client = redis.createClient(newPort, newHost);

    client.on('error', (err) => {
        console.error('Redis连接错误：' + err);
        process.exit(1);
    });

    client.on('connect', () => {
        console.log('Redis连接成功：' + url);
    });
}

module.exports = client;