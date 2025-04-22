<?php
// add_chapter.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit; // Xử lý yêu cầu preflight
}
// Thêm câu hỏi vào cơ sở dữ liệu
include 'connect.php';

$data = json_decode(file_get_contents("php://input"));

$question = $data->question;
$difficulty = $data->difficulty;
$subject = $data->subject;
$chapter = $data->chapter;
$answers = $data->answers;

// Insert the question into the database
$sql = "INSERT INTO cauhoi (noidung, dokho, mamonhoc, machuong, nguoitao, trangthai) 
        VALUES (?, ?, ?, ?, 'admin', 1)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("siii", $question, $difficulty, $subject, $chapter);
$stmt->execute();

$question_id = $stmt->insert_id; // Lấy ID của câu hỏi vừa thêm

// Add answers into cautraloi table
$correct = $answers->correct;
$answers_array = ['A', 'B', 'C', 'D'];
foreach ($answers_array as $answer) {
    $sql = "INSERT INTO cautraloi (macauhoi, noidungtl, ladapan) 
            VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("isi", $question_id, $answers->$answer, ($answer == $correct) ? 1 : 0);
    $stmt->execute();
}

echo json_encode(['success' => true, 'message' => 'Question added successfully']);
?>
