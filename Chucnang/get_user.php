<?php
session_start();

header("Access-Control-Allow-Origin: http://localhost:3000"); 
header("Access-Control-Allow-Methods: GET, OPTIONS"); 
header("Access-Control-Allow-Headers: Content-Type, X-CSRF-TOKEN"); 
header("Access-Control-Allow-Credentials: true"); 
header("Content-Type: application/json; charset=UTF-8");

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "Unauthorized - Please login again"]);
    exit();
}

$user_id = $_SESSION['user_id'];

try {
    $conn = new PDO('mysql:host=localhost;dbname=tracnghiemonline', 'root', '');
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $conn->prepare("SELECT id, hoten, email, sodienthoai, gioitinh, ngaysinh, avatar FROM nguoidung WHERE id = :id");
    $stmt->execute([':id' => $user_id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        // Xử lý avatar nếu không có
        if (empty($user['avatar'])) {
            $user['avatar'] = 'uploads/avatars/default-avatar.jpg'; // Đường dẫn đến ảnh mặc định
        }

        echo json_encode(["success" => true, "user" => $user]);
    } else {
        echo json_encode(["success" => false, "message" => "User not found"]);
    }
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error", "error" => $e->getMessage()]);
}
?>
