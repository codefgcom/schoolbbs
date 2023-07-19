const express = require('express');
const mysql = require('mysql2');
const config = require('./config.js');
const moment = require('moment');

console.info(config);

const app = express();

app.use('/', express.static('src/resources/static/'));


const pool = mysql.createPool({
    host: config.mysql.host,
    port: config.mysql.port,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
    connectionLimit: config.mysql.connectionLimit
});

// app.get('/', (req, res) => {
//     res.send('Hello World!')
// })

app.get('/sb', function (req, res) {
    res.send('Hello sb!')
});

app.get('/loadData', function (req, res) {
    pool.getConnection((error, connection) => {
        if (error) {
            console.error('Error getting database connection:', error);
        } else {
            connection.query('SELECT * FROM t_post_data ORDER BY RAND() limit 100', (error, results, fields) => {
                connection.release(); // 释放连接到连接池
                if (error) {
                    console.error('Error executing query:', error);
                    res.send({
                        success: false,
                        code: 500,
                        mssage: error
                    })
                } else {
                    console.log('Query results:', results);
                    // 处理查询结果
                    if (results && results.length) {
                        for (var i = 0; i < results.length; i++) {
                            let r = results[i];
                            const timeStr = moment(r.create_time).format('Y-MM-DD HH:mm:ss');
                            r.create_time = timeStr;
                        }
                    };
                    res.send({
                        success: true,
                        code: 0,
                        data: results
                    });
                }
            });
        }
    });
});








app.listen(config.port, () => {
    console.log(`app listening on port ${config.port}`)
})