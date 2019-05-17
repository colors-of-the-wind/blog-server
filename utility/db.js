const mongoose = require('mongoose');

const mongoConfig = require('../config').mongo;
const db = mongoose.connection;
const Schema = mongoose.Schema;
const {host, port, name} = mongoConfig;

const url = `mongodb://${host}:${port || 27017}/${name || ''}`;

mongoose.connect(url, {useNewUrlParser:true});

db.on('error', err => {
    console.error('mongo连接失败：', err);
    process.exit(1);
});

db.on('connected', () => {
    console.log('mongo连接成功：', url);
});

module.exports = Schema;
