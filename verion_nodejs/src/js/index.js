const express = require('express');
const app = express();
const config = require('./config.js');
const InstallRoute = require('./router.js');

console.info(config);

// 使用 body-parser 中间件来解析请求体参数
const bodyParser = require('body-parser');
app.use(bodyParser.json()); // 解析 JSON 格式的请求体参数
app.use(bodyParser.urlencoded({ extended: true })); // 解析 URL 编码的请求体参数

// app.get('/', (req, res) => {
//     res.send('Hello World!')
// })
app.use('/', express.static('src/resources/static/'));

InstallRoute(app);
app.listen(config.port, () => {
    console.log(`app listening on port ${config.port}`)
})