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



function generateUuidWithoutDashes()
{
    $data = random_bytes(16);
    // Set version to 4 (UUID version 4)
    $data[6] = chr(ord($data[6]) & 0x0f | 0x40);
    // Set bits 6-7 to 10 (UUID variant)
    $data[8] = chr(ord($data[8]) & 0x3f | 0x80);
    $hex = bin2hex($data);
    return substr($hex, 0, 8) . substr($hex, 8, 4) . substr($hex, 12, 4) . substr($hex, 16, 4) . substr($hex, 20);
}

// 生成 UUID 并去掉连字符
$id = generateUuidWithoutDashes();
$content = isset($_POST['content']) ? trim($_POST['content']) : '';
$author = isset($_POST['author']) ? trim($_POST['author']) : '';
$ip = $_SERVER['REMOTE_ADDR'];
$contact_info = isset($_POST['contact_info']) ? trim($_POST['contact_info']) : '';
$createTime = (new DateTime())->format('Y-m-d H:i:s');


// 简单的数据验证
if (empty($content)) {
    echo json_encode(['success' => false, 'code' => 500, 'data' => '内容不能为空']);
    $conn->close();
    exit;
}

// 使用准备好的语句避免 SQL 注入
$stmt = $conn->prepare("insert into t_post_data (id,content,author,ip,contact_info,create_time) VALUES (?,?,?,?,?,?)");
$stmt->bind_param('ssssss', $id, $content, $author, $ip, $contact_info, $createTime);

// 执行插入操作
if ($stmt->execute()) {
    echo json_encode(['success' => true, 'code' => 0, 'data' => '数据插入成功']);
} else {
    echo json_encode(['success' => false, 'code' => 500, 'data' => '数据插入失败: ' . $stmt->error]);
}

// 关闭语句和数据库连接
$stmt->close();
$conn->close();
?>