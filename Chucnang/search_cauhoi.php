<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET");

include 'connect.php'; // Kết nối với cơ sở dữ liệu

// Lấy dữ liệu từ yêu cầu GET
$keyword = isset($_GET['keyword']) ? $_GET['keyword'] : '';
$subject = isset($_GET['subject']) ? $_GET['subject'] : '';

// Chuẩn bị câu truy vấn SQL với điều kiện lọc
$sql = "SELECT * FROM cauhoi WHERE 1";

// Thêm điều kiện lọc theo môn học nếu có
if ($subject) {
    $sql .= " AND mamonhoc = :subject";
}

// Thêm điều kiện tìm kiếm theo từ khóa
if ($keyword) {
    $sql .= " AND noidung LIKE :keyword";
}

// Thực thi câu lệnh SQL
$stmt = $conn->prepare($sql);

// Gắn giá trị vào các tham số nếu có
if ($subject) {
    $stmt->bindParam(':subject', $subject, PDO::PARAM_INT);
}
if ($keyword) {
    $stmt->bindValue(':keyword', '%'.$keyword.'%', PDO::PARAM_STR);
}

$stmt->execute();

// Lấy kết quả trả về
$questions = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Kiểm tra và trả về dữ liệu
if ($questions && is_array($questions)) {
    echo json_encode([
        "success" => true,
        "data" => $questions
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Không có câu hỏi nào phù hợp"
    ]);
}
?>
