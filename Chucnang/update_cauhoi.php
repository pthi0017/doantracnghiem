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
    $stmt->bindParam(':macauhoi', $macauhoi, PDO::PARAM_INT);
    $stmt->bindParam(':noidung', $noidung, PDO::PARAM_STR);
    $stmt->bindParam(':dokho', $dokho, PDO::PARAM_INT);
    $stmt->bindParam(':mamonhoc', $mamonhoc, PDO::PARAM_INT);
    $stmt->bindParam(':machuong', $machuong, PDO::PARAM_INT);
    $stmt->execute();

    // Cập nhật đáp án
    $updateAnswerSQL = "UPDATE cautraloi 
                        SET noidungtl = :answerA 
                        WHERE macauhoi = :macauhoi AND ladapan = 1"; // Update answer A
    $stmtAnswerA = $conn->prepare($updateAnswerSQL);
    $stmtAnswerA->bindParam(':macauhoi', $macauhoi, PDO::PARAM_INT);
    $stmtAnswerA->bindParam(':answerA', $answers['A'], PDO::PARAM_STR);
    $stmtAnswerA->execute();

    // Repeat for B, C, and D
    $stmtAnswerB = $conn->prepare($updateAnswerSQL);
    $stmtAnswerB->bindParam(':answerB', $answers['B'], PDO::PARAM_STR);
    $stmtAnswerB->execute();

    $stmtAnswerC = $conn->prepare($updateAnswerSQL);
    $stmtAnswerC->bindParam(':answerC', $answers['C'], PDO::PARAM_STR);
    $stmtAnswerC->execute();

    $stmtAnswerD = $conn->prepare($updateAnswerSQL);
    $stmtAnswerD->bindParam(':answerD', $answers['D'], PDO::PARAM_STR);
    $stmtAnswerD->execute();

    // Cập nhật đáp án đúng
    $updateCorrectAnswerSQL = "UPDATE cautraloi 
                               SET ladapan = :correctAnswer 
                               WHERE macauhoi = :macauhoi AND ladapan = :correctAnswerOld";
    $stmtCorrectAnswer = $conn->prepare($updateCorrectAnswerSQL);
    $stmtCorrectAnswer->bindParam(':macauhoi', $macauhoi, PDO::PARAM_INT);
    $stmtCorrectAnswer->bindParam(':correctAnswer', $answers['correct'], PDO::PARAM_INT);
    $stmtCorrectAnswer->bindParam(':correctAnswerOld', $answers['correctOld'], PDO::PARAM_INT);
    $stmtCorrectAnswer->execute();

    echo json_encode(["success" => true, "message" => "Cập nhật câu hỏi thành công."]);

} catch (PDOException $e) {
    error_log("Lỗi khi cập nhật câu hỏi: " . $e->getMessage());
    echo json_encode(["success" => false, "error" => "Database Error: " . $e->getMessage()]);
}
?>
