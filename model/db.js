
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test')

var Schema = mongoose.Schema;

var test = new Schema({
	name: String,
	age: Number,
	sex: String
});

var people = mongoose.model('people', test, 'people');

var dbs = new people({
	name: '申伟康', 
	age: 18,
	sex: '男'
})

dbs.save(() => {
	people.find({age: 18}, (err, data) => {
		console.log('数据', data, data.length)
		mongoose.disconnect();
	})
})