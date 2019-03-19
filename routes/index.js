const users = require('./users')

module.exports = app => {
	app.get((req, res) => {
		res.render('index');
	})

	app.use('/user', users);
}
