<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once "connect.php";

try {
    if (!isset($_GET['subject'])) {
        echo json_encode(['success' => false, 'message' => 'Môn học không được cung cấp']);
        exit;
    }

    $subject_id = $_GET['subject'];

    // Lấy danh sách chương cho môn học theo subject_id
    $sql = "SELECT * FROM chuong WHERE mamonhoc = :subject_id AND trangthai = 1";
    $stmt = $conn->prepare($sql);
    $stmt->execute([':subject_id' => $subject_id]);
    
    $chapters = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($chapters && is_array($chapters)) {
        echo json_encode([
            "success" => true,
            "data" => $chapters
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Không có chương nào cho môn học này"
        ]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([ 
        "success" => false,
        "error" => "Database Error: " . $e->getMessage()
    ]);
}
?>