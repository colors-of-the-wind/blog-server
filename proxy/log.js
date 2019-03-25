const logModel = require('../models/log').LogModel;

/**
 * 获取所有日志
 * @param params 参数对象
 */
exports.getAll = params => new Promise((resolve, reject) =>{
    const size = parseInt(params.pageSize) || 10;

    let page = parseInt(params.pageIndex) || 1;

    page = page > 0 ? page : 1;
    
    options.skip = (page - 1) * size;
    options.limit = size;

    switch (params.sortName) {
        case 'level':
            options.sort = params.sortOrder === 'desc' ? '-level -timestamp' : 'level timestamp';
            break;
        default:
            options.sort = params.sortOrder === 'desc' ? '-timestamp' : 'timestamp';
    }

    logModel.find({}, {}, options, (err, logs) => {
        if (err) return reject(err);

        return resolve(logs);
    });

})

/**
 * 获取日志数
 * @param params 参数对象
 */
exports.getAllCount =  params => new Promise((resolve, reject) =>{
    logModel.count((err, count) => {
        if (err) return reject(err);
        
        return resolve(count);
    });
}
