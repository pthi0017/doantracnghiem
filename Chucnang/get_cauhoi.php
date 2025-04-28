<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");

$host = "localhost";
$username = "root";
$password = "";
$database = "tracnghiemonline";

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$database;charset=utf8mb4",
        $username,
        $password,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]
    );
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Kết nối CSDL thất bại: " . $e->getMessage()]);
    exit;
}

// Lấy tham số từ request
$keyword = isset($_GET['keyword']) ? trim($_GET['keyword']) : '';
$subject = isset($_GET['subject']) ? $_GET['subject'] : '';

// Xây dựng câu truy vấn SQL với điều kiện tìm kiếm
$sql = "SELECT macauhoi, noidung, dokho, mamonhoc, machuong FROM cauhoi WHERE 1";

if ($keyword) {
    $sql .= " AND noidung LIKE :keyword"; // Tìm kiếm theo nội dung câu hỏi
}

if ($subject) {
    $sql .= " AND mamonhoc = :subject"; // Tìm kiếm theo mã môn học
}

$stmt = $pdo->prepare($sql);

if ($keyword) {
    $stmt->bindValue(':keyword', '%' . $keyword . '%', PDO::PARAM_STR);
}
if ($subject) {
    $stmt->bindParam(':subject', $subject, PDO::PARAM_STR);
}

$stmt->execute();

$cauhoi = $stmt->fetchAll();

if ($cauhoi) {
    echo json_encode([
        "success" => true,
        "data" => $cauhoi
    ]);
} else {
    echo json_encode([
        "success" => true, // Trả về success nhưng với mảng rỗng
        "data" => [],
        "message" => "Không có câu hỏi nào phù hợp"
    ]);
}
?>
