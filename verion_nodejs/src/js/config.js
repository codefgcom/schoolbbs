module.exports = {
    port: 80,
    mysql: {
        host: 'localhost',
        port: 3366,
        user: 'root',
        password: 'rootroot',
        database: 'test_sb',
        connectionLimit: 10 // 设置连接池大小
    }
}