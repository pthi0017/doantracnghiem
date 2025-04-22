<?php
session_start();

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, X-CSRF-TOKEN, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "Unauthorized - Please login again"]);
    exit();
}

$data = $_POST;
$user_id = $_SESSION['user_id'];

// Xử lý file avatar (nếu có)
$avatarPath = null;
if (isset($_FILES['avatar']) && $_FILES['avatar']['error'] === UPLOAD_ERR_OK) {
    $uploadDir = 'uploads/avatars/';
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $fileExt = pathinfo($_FILES['avatar']['name'], PATHINFO_EXTENSION);
    $fileName = 'user_' . $user_id . '_' . time() . '.' . $fileExt;
    $targetPath = $uploadDir . $fileName;

    if (move_uploaded_file($_FILES['avatar']['tmp_name'], $targetPath)) {
        $avatarPath = $targetPath;
    }
}

// Kiểm tra dữ liệu và gán giá trị mặc định nếu không có
$hoten = !empty($data['hoten']) ? htmlspecialchars(trim($data['hoten'])) : '';
$sodienthoai = !empty($data['sodienthoai']) ? preg_replace('/[^0-9]/', '', $data['sodienthoai']) : '';
$gioitinh = isset($data['gioitinh']) ? (int)$data['gioitinh'] : null;  // Nếu không có, mặc định là Nam
$ngaysinh = !empty($data['ngaysinh']) ? date('Y-m-d', strtotime($data['ngaysinh'])) : null;

try {
    $conn = new PDO('mysql:host=localhost;dbname=tracnghiemonline', 'root', '');
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql = "UPDATE nguoidung SET 
            hoten = :hoten, 
            sodienthoai = :sodienthoai, 
            gioitinh = :gioitinh, 
            ngaysinh = :ngaysinh" . 
            ($avatarPath ? ", avatar = :avatar" : "") . "
            WHERE id = :id";

    $stmt = $conn->prepare($sql);

    $params = [
        ':hoten' => $hoten,
        ':sodienthoai' => $sodienthoai,
        ':gioitinh' => $gioitinh,
        ':ngaysinh' => $ngaysinh,
        ':id' => $user_id
    ];

    if ($avatarPath) {
        $params[':avatar'] = $avatarPath;
    }

    $stmt->execute($params);

    // Lấy lại thông tin người dùng sau khi cập nhật
    $stmt = $conn->prepare("SELECT id, hoten, email, sodienthoai, gioitinh, ngaysinh, avatar FROM nguoidung WHERE id = :id");
    $stmt->execute([':id' => $user_id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode(["success" => true, "user" => $user]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error during update", "error" => $e->getMessage()]);
}
?>
