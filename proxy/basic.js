const fs = require('fs');
const path = require('path');

const { setLog } = require('./logger');
const { getItem, setItem } = require('../utility/radis');


/**
 * 查询博客基本信息
 */
exports.getBlogInfo = () => new Promise((resolve, reject) => {
    getItem('blogInfo', (err, data) => {
        if (err) {
            setLog(err, 1);
            return reject({err, msg: '读取失败'});
        }

        if (data) return resolve(data);

        fs.readFile(path.resolve(__dirname, '../config/settings.json'), (err, buffer) => {
            if (err) {
                setLog(err, 3);
                return reject({err, msg: '读取文件失败'});
            }

            const bufStr = buffer.toString();
          
            const result = JSON.parse(bufStr)

            resolve(result);
            setItem('blogInfo', result, err => {
                if (err) setLog(err, 1);
            }, 'json', 1296000);
        });
    });
});
