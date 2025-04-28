<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Bao gồm kết nối cơ sở dữ liệu
require_once "connect.php";

try {
    // Câu truy vấn lấy môn học và số lượng đề thi
    $sql = "SELECT m.mamonhoc, m.tenmonhoc, COUNT(d.made) AS so_de_thi
            FROM monhoc m
            LEFT JOIN dethi d ON m.mamonhoc = d.monthi AND d.trangthai = 1
            WHERE m.trangthai = 1
            GROUP BY m.mamonhoc";
    
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    
    $subjects = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (is_array($subjects) && count($subjects) > 0) {
        echo json_encode([
            "success" => true,
            "data" => $subjects
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Không có dữ liệu môn học"
        ]);
    }

} catch (PDOException $e) {
    // Ghi lỗi chi tiết và trả về thông báo lỗi
    error_log("Lỗi khi truy vấn cơ sở dữ liệu: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Database Error: " . $e->getMessage()
    ]);
}
?>
