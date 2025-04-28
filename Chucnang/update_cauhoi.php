<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Bao gồm kết nối cơ sở dữ liệu
require_once "connect.php";

// Nhận dữ liệu từ client (React)
$data = json_decode(file_get_contents("php://input"), true);

// Kiểm tra nếu có các tham số cần thiết
if (!isset($data['macauhoi'], $data['noidung'], $data['dokho'], $data['mamonhoc'], $data['machuong'], $data['answers'])) {
    echo json_encode(["success" => false, "message" => "Thiếu dữ liệu cần thiết."]);
    exit;
}

$macauhoi = $data['macauhoi'];
$noidung = $data['noidung'];
$dokho = $data['dokho'];
$mamonhoc = $data['mamonhoc'];
$machuong = $data['machuong'];
$answers = $data['answers'];  // Including answers A, B, C, D and correct answer

try {
    // Cập nhật câu hỏi trong cơ sở dữ liệu
    $sql = "UPDATE cauhoi 
            SET noidung = :noidung, dokho = :dokho, mamonhoc = :mamonhoc, machuong = :machuong 
            WHERE macauhoi = :macauhoi";

    $stmt = $conn->prepare($sql);

    // Gắn các tham số vào câu truy vấn
    $stmt->bindParam(':macauhoi', $macauhoi, PDO::PARAM_INT);
    $stmt->bindParam(':noidung', $noidung, PDO::PARAM_STR);
    $stmt->bindParam(':dokho', $dokho, PDO::PARAM_INT);
    $stmt->bindParam(':mamonhoc', $mamonhoc, PDO::PARAM_INT);
    $stmt->bindParam(':machuong', $machuong, PDO::PARAM_INT);

    // Thực thi câu truy vấn
    $stmt->execute();

    // Cập nhật hoặc thêm các đáp án vào bảng cautraloi
    $updateAnswersSQL = "UPDATE cautraloi 
                         SET noidungtl = :answerA, ladapan = :correctAnswer 
                         WHERE macauhoi = :macauhoi AND ladapan = 1";  // assuming ladapan = 1 for correct answer

    $stmtAnswers = $conn->prepare($updateAnswersSQL);
    $stmtAnswers->bindParam(':macauhoi', $macauhoi, PDO::PARAM_INT);
    $stmtAnswers->bindParam(':answerA', $answers['A'], PDO::PARAM_STR);
    $stmtAnswers->bindParam(':correctAnswer', $answers['correct'], PDO::PARAM_INT);

    $stmtAnswers->execute();

    // Kiểm tra nếu có dòng bị ảnh hưởng
    if ($stmt->rowCount() > 0 || $stmtAnswers->rowCount() > 0) {
        echo json_encode(["success" => true, "message" => "Cập nhật câu hỏi thành công."]);
    } else {
        echo json_encode(["success" => false, "message" => "Không tìm thấy câu hỏi hoặc không có thay đổi."]);
    }

} catch (PDOException $e) {
    // Ghi lại lỗi và trả về thông báo lỗi
    error_log("Lỗi khi cập nhật câu hỏi: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Database Error: " . $e->getMessage()]);
}
?>
