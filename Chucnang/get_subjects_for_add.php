<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once "connect.php";

try {
    $sql = "SELECT m.mamonhoc, m.tenmonhoc, COUNT(d.made) AS so_de_thi
            FROM monhoc m
            LEFT JOIN dethi d ON m.mamonhoc = d.monthi AND d.trangthai = 1
            WHERE m.trangthai = 1
            GROUP BY m.mamonhoc";
    
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    
    $subjects = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Kiểm tra xem dữ liệu trả về có phải là mảng và không rỗng
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
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Database Error: " . $e->getMessage()
    ]);
}
?>