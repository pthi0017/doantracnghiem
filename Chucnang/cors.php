<?php
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

// Cho phép bất kỳ localhost:<port> nào hoặc domain cụ thể
if (preg_match('/^http:\/\/localhost:\d+$/', $origin) || in_array($origin, [
    'https://your-production-domain.com'
])) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
}

header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, X-CSRF-TOKEN");
header("Content-Type: application/json; charset=UTF-8");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");

// Xử lý preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}
?>
