const LogModel = require('../models/Log');
const storage = require('../config.json').log.storage;


/**
 * 获取所有日志
 * @param params 参数对象
 */
exports.getAll = params => new Promise((resolve, reject) =>{
    if (!storage) resolve(null);

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

    LogModel.find({}, {}, options, (err, logs) => {
        if (err) return reject(err);

        return resolve(logs);
    });
});

/**
 * 获取日志数
 * @param params 参数对象
 */
exports.getAllCount =  params => new Promise((resolve, reject) =>{
    if (!storage) resolve(0);

    LogModel.count((err, count) => {
        if (err) return reject(err);
        
        return resolve(count);
    });
});


/**
 * [description]
 * @param  {Object} meta  错误error对象
 * @param  {Number} level 错误级别 => 0: warn 1: error
 */
exports.setLog = (meta, specie = 0, level = 1) => new Promise((resolve, reject) =>{

    const species = ['mongoDB', 'Raids', 'Router', 'Global']

    if (!storage) {
        log = level ? console.error : console.warn

        log(species[specie], meta, meta.message || '');
        resolve();
    }

    const errorLog = new LogModel({
        message: meta.message || '',
        timestamp: new Date(),
        level,
        meta,
        specie: species[specie]
    });

    errorLog.save();
});