const Schema = require('./db');

const LabelSchema = new Schema({
    // 标签名
    labelName: {type: String, required: true},
    // 标签图标
    icon: {type: String, required: true},
    // 创建时间
	createTime: {type: Date, required: true},
	// 是否删除 => 0: 未删除 1: 已删除
	delete: {type: Number, required: true},
    // 创建者id
	user_id: {type: Schema.Types.ObjectId, required: true}
});

const LabelModel = mongoose.model('Label', AccountSchema, 'Label');

module.exports = LabelModel;