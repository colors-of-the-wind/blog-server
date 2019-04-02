const mongoose = require('mongoose');
const md5 = require('md5');
const SALT_TEXT = '风的颜色-2019-03-29';
const SALT_CODE = md5(SALT_TEXT);
const defaultPwd = '123456';

// 字符串id转ObjectId
exports.toObjectId = id => mongoose.Types.ObjectId(id);

// ObjectId转字符串id
exports.toStringId = id => mongoose.Types.ObjectId(id).toString();

// “盐”
exports.salt = SALT_CODE;

// 转Md5
exports.toMd5 = md5;

// 加“盐”Md5
exports.toSaltMd5 = text => md5(SALT_CODE + text);

// 默认密码加“盐”
exports.defaultPwd = md5(SALT_CODE + defaultPwd);