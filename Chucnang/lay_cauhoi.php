<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

// Kết nối cơ sở dữ liệu
require_once "connect.php";

// Nhận mã câu hỏi từ yêu cầu
$id = isset($_GET['id']) ? $_GET['id'] : null;

if (!$id) {
    echo json_encode(["success" => false, "message" => "Mã câu hỏi không hợp lệ."]);
    exit;
}

try {
    // Lấy thông tin câu hỏi từ cơ sở dữ liệu
    $sql = "SELECT c.macauhoi, c.noidung, c.dokho, c.mamonhoc, c.machuong,
                   ca.noidungtl as answerA, ca.ladapan as correctAnswer
            FROM cauhoi c
            LEFT JOIN cautraloi ca ON c.macauhoi = ca.macauhoi
            WHERE c.macauhoi = :macauhoi";

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':macauhoi', $id, PDO::PARAM_INT);
    $stmt->execute();

    $question = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($question) {
        echo json_encode(["success" => true, "data" => $question]);
    } else {
        echo json_encode(["success" => false, "message" => "Câu hỏi không tồn tại"]);
    }

} catch (PDOException $e) {
    // Ghi lại lỗi và trả về thông báo lỗi
    error_log("Lỗi khi truy vấn câu hỏi: " . $e->getMessage());
    echo json_encode(["success" => false, "error" => "Lỗi hệ thống"]);
}
?>
