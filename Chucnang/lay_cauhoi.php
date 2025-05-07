<?php
header("Content-Type: application/json; charset=UTF-8");
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
    $sql = "SELECT c.macauhoi, c.noidung, c.dokho, c.mamonhoc, c.machuong
            FROM cauhoi c
            WHERE c.macauhoi = :macauhoi";

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':macauhoi', $id, PDO::PARAM_INT);
    $stmt->execute();
    $question = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($question) {
        // Lấy các đáp án từ bảng cautraloi
        $sql_answers = "SELECT ca.noidungtl, ca.ladapan
                        FROM cautraloi ca
                        WHERE ca.macauhoi = :macauhoi";
        $stmt_answers = $conn->prepare($sql_answers);
        $stmt_answers->bindParam(':macauhoi', $id, PDO::PARAM_INT);
        $stmt_answers->execute();
        $answers = $stmt_answers->fetchAll(PDO::FETCH_ASSOC);

        // Kiểm tra nếu có đáp án
        $answerA = $answerB = $answerC = $answerD = null;
        $correctAnswer = 0;

        foreach ($answers as $answer) {
            if ($answer['ladapan'] == 1) $answerA = $answer['noidungtl'];  // Đáp án A
            if ($answer['ladapan'] == 2) $answerB = $answer['noidungtl'];  // Đáp án B
            if ($answer['ladapan'] == 3) $answerC = $answer['noidungtl'];  // Đáp án C
            if ($answer['ladapan'] == 4) $answerD = $answer['noidungtl'];  // Đáp án D
        }

        // Lấy đáp án đúng
        if ($answerA) {
            $correctAnswer = 'A'; // Giả sử nếu A có giá trị thì A là đúng
        } elseif ($answerB) {
            $correctAnswer = 'B';
        } elseif ($answerC) {
            $correctAnswer = 'C';
        } elseif ($answerD) {
            $correctAnswer = 'D';
        }

        echo json_encode([
            "success" => true,
            "data" => [
                "macauhoi" => $question['macauhoi'],
                "noidung" => $question['noidung'],
                "dokho" => $question['dokho'],
                "mamonhoc" => $question['mamonhoc'],
                "machuong" => $question['machuong'],
                "answerA" => $answerA,
                "answerB" => $answerB,
                "answerC" => $answerC,
                "answerD" => $answerD,
                "correctAnswer" => $correctAnswer
            ]
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Câu hỏi không tồn tại"]);
    }

} catch (PDOException $e) {
    // Ghi lại lỗi và trả về thông báo lỗi
    error_log("Lỗi khi truy vấn câu hỏi: " . $e->getMessage());
    echo json_encode(["success" => false, "error" => "Lỗi hệ thống"]);
}
?>