<?php
session_start();

// Cấu hình CORS và COOP, COEP
header("Access-Control-Allow-Origin: http://localhost:3000");  // Cho phép yêu cầu từ frontend React
header("Access-Control-Allow-Methods: POST, OPTIONS");  // Cho phép POST và OPTIONS
header("Access-Control-Allow-Headers: Content-Type, X-CSRF-TOKEN, Authorization");  // Cấu hình các header cho phép
header("Access-Control-Allow-Credentials: true");  // Cho phép gửi cookies từ frontend
header("Content-Type: application/json; charset=UTF-8");

// Cấu hình COOP và COEP
header("Cross-Origin-Opener-Policy: unsafe-none");  // Cho phép popup từ các origin khác
header("Cross-Origin-Embedder-Policy: unsafe-none"); // Tắt COEP để không yêu cầu CORP headers

// Xử lý preflight request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header("HTTP/1.1 200 OK");
    exit(0);  // Trả về OK nếu là preflight request
}

$data = json_decode(file_get_contents("php://input"), true);  // Nhận dữ liệu từ request

// Kiểm tra token Google trong request
if (isset($data['token'])) {
    $token = $data['token'];

    // Thực hiện việc kiểm tra token với Google
    $url = "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=$token";
    
    // Gửi request tới Google để kiểm tra token
    $response = file_get_contents($url);
    $response = json_decode($response, true);

    if (isset($response['error'])) {
        echo json_encode(['error' => 'Invalid token']);
        exit;
    }

    // Token hợp lệ, lấy thông tin người dùng
    $name = $response['name'];
    $email = $response['email'];
    $avatar = $response['picture'];  // Avatar từ Google

    // Trả về thông tin người dùng
    $response = [
        'success' => true,
        'user' => [
            'name' => $name,
            'email' => $email,
            'avatar' => $avatar,
        ],
        'token' => 'your-generated-jwt-token' // Bạn có thể tạo JWT cho người dùng
    ];

    echo json_encode($response);
} else {
    echo json_encode(['error' => 'No Google token']);
}
?>
