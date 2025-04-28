<?php
// Thông tin kết nối cơ sở dữ liệu
$host = "localhost";
$username = "root";  // Thay đổi nếu cần
$password = "";      // Thay đổi nếu cần
$database = "tracnghiemonline"; // Tên cơ sở dữ liệu của bạn

try {
    // Tạo kết nối PDO
    $conn = new PDO("mysql:host=$host;dbname=$database;charset=utf8mb4", $username, $password);
    
    // Thiết lập chế độ báo lỗi
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    // Ghi lại lỗi kết nối và trả về thông báo lỗi
    error_log("Lỗi kết nối CSDL: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Lỗi kết nối cơ sở dữ liệu"]);
    exit;
}
?>