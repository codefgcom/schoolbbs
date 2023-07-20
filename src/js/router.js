
const mysql = require('mysql2');
const moment = require('moment');
const config = require('./config.js');
const uuid = require('uuid');

const pool = mysql.createPool({
    host: config.mysql.host,
    port: config.mysql.port,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
    connectionLimit: config.mysql.connectionLimit
});

function InstallRoute(app) {
    app.get('/loadData', function (req, res) {
        pool.getConnection((error, connection) => {
            if (error) {
                console.error('Error getting database connection:', error);
                res.send({
                    success: false,
                    code: 500,
                    mssage: error
                });
                return;
            } else {
                connection.query('SELECT * FROM t_post_data ORDER BY RAND() limit 30', (error, results, fields) => {
                    connection.release(); // 释放连接到连接池
                    if (error) {
                        console.error('Error executing query:', error);
                        res.send({
                            success: false,
                            code: 500,
                            mssage: error
                        });
                        return;
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
                        return;
                    }
                });
            }
        });
    });

    app.post('/sendMsg', function (req, res) {
        pool.getConnection((error, connection) => {
            if (error) {
                console.error('Error getting database connection:', error);
                res.send({
                    success: false,
                    code: 500,
                    mssage: error
                });
                return;
            } else {
                connection.query('insert into t_post_data  SET ?', {
                    id: uuid.v4().replaceAll("-", ""),
                    content: req.body.content,
                    author: req.body.author,
                    contact_info: req.body.contact_info,
                    create_time: moment().format('Y-MM-DD HH:mm:ss'),
                    ip: req.ip
                }, (error, results, fields) => {
                    connection.release(); // 释放连接到连接池
                    if (error) {
                        console.error('Error executing query:', error);
                        res.send({
                            success: false,
                            code: 500,
                            mssage: error
                        });
                        return;
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
                        return;
                    }
                });
            }
        });
    });
}

module.exports = InstallRoute;