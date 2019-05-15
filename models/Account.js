const mongoose = require('mongoose');
const Schema = require('./db');

const AccountSchema = new Schema({
    // 用户名
    username: {type: String, required: true},
    // 密码
    password: {type: String, required: true},
    // 是否冻结 => 0: 正常 1: 冻结
	freeze: {type: Number, required: true},
    // 身份权限 => 0: 管理员 1: vip 2: 访客
    role: {type: Number, required: true},
    // 创建时间
    createTime: {type: Number, required: true},
    // 修改时间
    modifyTime: {type: Number},
    // 头像
    avatar: {type: String}
});

const AccountModel = mongoose.model('Account', AccountSchema, 'Account');

module.exports = AccountModel;