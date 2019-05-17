const mongoose = require('mongoose');
const Schema = require('../utility/db');

const LogSchema = new Schema({
    // 异常信息
    message: {type: String, required: true},
    // 记录时间
    timestamp: {type: String, required: true},
    // 级别  => 0: warn 1: error
    level: {type: Number, required: true},
    // 详细信息
    meta: {type: Schema.Types.Mixed, required: true},
    // 错误产生系统
    specie: {type: String, required: true}
});

const LogModel = mongoose.model('Log', LogSchema, 'Log');

module.exports = LogModel;