<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include 'connect.php'; // Đảm bảo kết nối tới cơ sở dữ liệu

$data = json_decode(file_get_contents("php://input"));

// Kiểm tra nếu dữ liệu có hợp lệ
if (!isset($data->question) || !isset($data->difficulty) || !isset($data->subject) || !isset($data->chapter) || !isset($data->answers)) {
    echo json_encode(['success' => false, 'message' => 'Dữ liệu không hợp lệ']);
    exit;
}

$question = $data->question;
$difficulty = $data->difficulty;
$subject = $data->subject;
$chapter = $data->chapter;
$answers = $data->answers;

// Sử dụng PDO để chuẩn bị và thực thi câu lệnh SQL
try {
    $sql = "INSERT INTO cauhoi (noidung, dokho, mamonhoc, machuong, nguoitao, trangthai) 
            VALUES (:question, :difficulty, :subject, :chapter, 'admin', 1)";
    
    // Chuẩn bị câu lệnh SQL
    $stmt = $conn->prepare($sql);

    // Liên kết các tham số
    $stmt->bindValue(':question', $question, PDO::PARAM_STR);
    $stmt->bindValue(':difficulty', $difficulty, PDO::PARAM_INT);
    $stmt->bindValue(':subject', $subject, PDO::PARAM_INT);
    $stmt->bindValue(':chapter', $chapter, PDO::PARAM_INT);

    // Thực thi câu lệnh SQL
    $stmt->execute();

    // Lấy ID của câu hỏi vừa thêm vào
    $question_id = $conn->lastInsertId();

    // Thêm các câu trả lời vào bảng cautraloi
    $correct = $answers->correct;
    $answers_array = ['A', 'B', 'C', 'D'];
    foreach ($answers_array as $answer) {
        $sql_answer = "INSERT INTO cautraloi (macauhoi, noidungtl, ladapan) 
                       VALUES (:question_id, :answer, :correct)";
        
        $stmt_answer = $conn->prepare($sql_answer);
        $stmt_answer->bindValue(':question_id', $question_id, PDO::PARAM_INT);
        $stmt_answer->bindValue(':answer', $answers->$answer, PDO::PARAM_STR);
        $stmt_answer->bindValue(':correct', ($answer == $correct) ? 1 : 0, PDO::PARAM_INT);
        $stmt_answer->execute();
    }

    echo json_encode(['success' => true, 'message' => 'Thêm câu hỏi thành công']);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Lỗi khi thêm câu hỏi: ' . $e->getMessage()]);
}
?>
