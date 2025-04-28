<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once "connect.php";

// Lấy tham số môn học
$subject = isset($_GET['subject']) ? $_GET['subject'] : '';

try {
    if (!$subject) {
        throw new Exception('Mã môn học không hợp lệ.');
    }

    // Truy vấn lấy các chương theo môn học
    $sql = "SELECT * FROM chuong WHERE mamonhoc = :subject";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':subject', $subject, PDO::PARAM_INT);
    $stmt->execute();
    
    $chapters = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (is_array($chapters) && count($chapters) > 0) {
        echo json_encode([
            "success" => true,
            "data" => $chapters
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Không có chương nào"
        ]);
    }

} catch (PDOException $e) {
    // Ghi lại lỗi và trả về thông báo lỗi
    error_log("Lỗi khi truy vấn chương: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Database Error: " . $e->getMessage()
    ]);
} catch (Exception $e) {
    // Lỗi khác (ví dụ: mã môn học không hợp lệ)
    error_log("Lỗi: " . $e->getMessage());
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}
?>
