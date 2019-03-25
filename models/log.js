const Schema = require('./db');

const LogSchema = new Schema({
    // 异常信息
    message: {type: String, required: true},
    // 记录时间
    timestamp: {type: String, required: true},
    // 级别
    level: {type: Number, required: true},
    // 详细信息
    meta: {type: Schema.Type.Mixed, required: true}
});

const LogModel = mongoose.model('Log', AccountSchema, 'Log');

module.exports = LogModel;