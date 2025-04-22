<?php
session_start();  // Khởi tạo session

header("Access-Control-Allow-Origin: http://localhost:3000"); 
header("Access-Control-Allow-Methods: POST, OPTIONS"); 
header("Access-Control-Allow-Headers: Content-Type, X-CSRF-TOKEN"); 
header("Access-Control-Allow-Credentials: true"); 
header("Content-Type: application/json; charset=UTF-8");

$input = file_get_contents("php://input");
$data = json_decode($input, true);

$email = trim($data['email'] ?? '');
$password = trim($data['matkhau'] ?? '');

// Kiểm tra email và mật khẩu trong cơ sở dữ liệu
try {
    $conn = new PDO('mysql:host=localhost;dbname=tracnghiemonline', 'root', '');
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $stmt = $conn->prepare("SELECT * FROM nguoidung WHERE email = :email LIMIT 1");
    $stmt->execute([':email' => $email]);

    if ($stmt->rowCount() === 0) {
        echo json_encode(['success' => false, 'message' => 'Tài khoản không tồn tại']);
        exit;
    }

    $user = $stmt->fetch();

    if (!password_verify($password, $user['matkhau'])) {
        echo json_encode(['success' => false, 'message' => 'Mật khẩu không đúng']);
        exit;
    }

    $_SESSION['user_id'] = $user['id'];  // Lưu ID người dùng vào session

    // Kiểm tra quyền admin
    $role = $user['manhomquyen']; // Kiểm tra quyền của người dùng (1: admin, 0: người dùng bình thường)

    // Trả về thông tin người dùng
    echo json_encode([
        'success' => true,
        'message' => 'Đăng nhập thành công',
        'user' => [
            'id' => $user['id'],
            'email' => $user['email'],
            'hoten' => $user['hoten'],
            'manhomquyen' => $role, // Trả về nhóm quyền
            'avatar' => $user['avatar'], // Trả về avatar
            'role' => $role // Trả về role để xử lý frontend
        ]
    ]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Lỗi kết nối cơ sở dữ liệu: ' . $e->getMessage()]);
}
?>