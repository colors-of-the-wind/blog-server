const EMAIL_REG = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
const PHONE_REG = /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/;
const IPV4_REG = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
const PWD_REG =  /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;


// 验证邮箱格式
exports.isEmail = email => EMAIL_REG.test(email);

// 验证手机格式
exports.isPhone = phone => PHONE_REG.test(phone);

// 验证IP格式
exports.isIpv4 = ip => IPV4_REG.test(ip);

// 验证密码格式
exports.isPwd = pwd => PWD_REG.test(pwd);
