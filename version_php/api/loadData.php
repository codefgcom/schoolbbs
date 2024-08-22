<?php
// 数据库配置
include_once 'config.php';
header('Content-Type: application/json; charset=utf-8');

// 创建数据库连接
$conn = new mysqli($mysql_host, $mysql_user, $mysql_psw, $mysql_db);
// 检查连接
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'code' => 500, 'data' => $conn->connect_error]);
    $conn->close();
    exit;
}
$conn->set_charset('utf8');

// 查询当前页的数据
$sql = 'SELECT * FROM t_post_data ORDER BY RAND() limit 10';
$result = $conn->query($sql);

$data = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

echo json_encode([
    'success' => true,
    'code' => 0,
    'data' => $data,
]);

// 关闭数据库连接
$conn->close();
?>