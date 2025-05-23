<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

include('connect.php'); // Biến $conn đã được khai báo ở đây

if (isset($_GET['id']) && is_numeric($_GET['id'])) {
    $id = intval($_GET['id']);

    try {
        // Bắt đầu transaction để đảm bảo tính toàn vẹn
        if ($conn) {
            $conn->beginTransaction();

            // 1. Xóa chitietketqua liên quan đến các đáp án trong câu hỏi này
            $deleteDetails = $conn->prepare("
                DELETE FROM chitietketqua 
                WHERE dapanchon IN (SELECT macautl FROM cautraloi WHERE macauhoi = :id)
            ");
            $deleteDetails->bindParam(':id', $id, PDO::PARAM_INT);
            $deleteDetails->execute();

            // 2. Xóa các đáp án liên quan
            $deleteAnswers = $conn->prepare("DELETE FROM cautraloi WHERE macauhoi = :id");
            $deleteAnswers->bindParam(':id', $id, PDO::PARAM_INT);
            $deleteAnswers->execute();

            // 3. Xóa câu hỏi
            $deleteQuestion = $conn->prepare("DELETE FROM cauhoi WHERE macauhoi = :id");
            $deleteQuestion->bindParam(':id', $id, PDO::PARAM_INT);
            $deleteQuestion->execute();

            // Kết thúc transaction
            $conn->commit();

            echo json_encode([
                "status" => "success",
                "message" => "Câu hỏi và các dữ liệu liên quan đã được xóa thành công."
            ]);
        } else {
            echo json_encode([
                "status" => "error",
                "message" => "Lỗi kết nối cơ sở dữ liệu."
            ]);
        }
    } catch (PDOException $e) {
        $conn->rollBack(); // Hoàn tác nếu có lỗi
        echo json_encode([
            "status" => "error",
            "message" => "Lỗi CSDL: " . $e->getMessage() . ' | ' . implode(", ", $e->errorInfo) // Thêm thông tin chi tiết lỗi
        ]);
    }
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Tham số ID không hợp lệ hoặc bị thiếu."
    ]);
}
?>
