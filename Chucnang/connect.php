    <?php
    $host = "localhost";
    $username = "root";
    $password = "";
    $database = "tracnghiemonline";

    try {
        $conn = new PDO(
            "mysql:host=$host;dbname=$database;charset=utf8mb4",
            $username,
            $password,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]
        );
    } catch (PDOException $e) {
        error_log("Lỗi kết nối DB: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Lỗi kết nối CSDL"]);
        exit;
    }
    ?>
