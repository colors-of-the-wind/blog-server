const mongoose = require('mongoose');
const Schema = require('../utility/db');

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
    modifyTime: {type: Number, default: Date.now},
    // 头像
    avatar: {type: String, default: 'http://img0.imgtn.bdimg.com/it/u=2294562579,3637209517&fm=11&gp=0.jpg'},
    // 用户昵称
    nickname: {type: String, default: '匿名'}
});

const AccountModel = mongoose.model('Account', AccountSchema, 'Account');

module.exports = AccountModel;