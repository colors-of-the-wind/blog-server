const Schema = require('./db');

const SpeciesSchema = new Schema({
    // 分类名
    speciesName: {type: String, required: true},
    // 创建时间
	createTime: {type: Date, required: true},
	// 是否删除 => 0: 未删除 1: 已删除
	delete: {type: Number, required: true},
	// 创建者id
	user_id: {type: Schema.Types.ObjectId, required: true}
});

const SpeciesModel = mongoose.model('species', SpeciesSchema, 'species');

module.exports = SpeciesModel;