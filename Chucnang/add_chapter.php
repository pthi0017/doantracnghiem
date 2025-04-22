<?php
session_start();
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Include database connection
include 'connect.php';

// Lấy dữ liệu từ frontend
$data = json_decode(file_get_contents("php://input"));

// Kiểm tra nếu có dữ liệu cần thiết
if (!isset($data->subject) || !isset($data->newChapterName)) {
    echo json_encode(['success' => false, 'message' => 'Dữ liệu không hợp lệ hoặc thiếu trường bắt buộc']);
    exit;
}

$subject_id = $data->subject;
$new_chapter_name = $data->newChapterName;

// Insert dữ liệu vào bảng chuong bằng PDO
try {
    $sql = "INSERT INTO chuong (tenchuong, mamonhoc, trangthai) VALUES (:tenchuong, :mamonhoc, 1)";
    $stmt = $conn->prepare($sql);

    // Gán giá trị cho các tham số
    $stmt->bindParam(':tenchuong', $new_chapter_name, PDO::PARAM_STR);
    $stmt->bindParam(':mamonhoc', $subject_id, PDO::PARAM_INT);

    // Thực thi câu lệnh
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Thêm chương thành công']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Thêm thất bại']);
    }

} catch (PDOException $e) {
    // Xử lý lỗi khi thực thi câu lệnh
    echo json_encode(['success' => false, 'message' => 'Lỗi khi thêm chương: ' . $e->getMessage()]);
}
?>
