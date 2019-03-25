const users = require('./users')

module.exports = app => {
	app.get((req, res) => {
		res.render('index');
	})

	app.use('/user', users);
}


// 滑动验证

// app.post('/verify', function (req,res) {
//     const result = req.body;
//     const queryConfig = {
//         'aid': "***",
//         'AppSecretKey': '***',
//         'Ticket': result.ticket,
//         'Randstr': result.randstr,
//         'UserIP': '*.*.*.*' //客户端IP
//     };
//     const getUrl = 'https://ssl.captcha.qq.com/ticket/verify' + setQueryConfig(queryConfig);
//     http.get(getUrl, function (response) {
//         var body = [];
//         response.on('data', function (chunk) {
//             body.push(chunk);
//         });
//         response.on('end', function () {
//             body = JSON.parse(Buffer.concat(body));
//             res.set('Content-Type', 'application/json;charset=utf-8');
//             if(body.response == 1) {
//                 res.status(200).send({"code": 0, "msg": "ok"});
//                 res.end();
//             }
//         });
//     });
// })
