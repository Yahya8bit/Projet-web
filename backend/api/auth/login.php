<?php
require_once __DIR__ . '/../../../db.php';
require_once __DIR__ . '/../../../jwt.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$body     = json_decode(file_get_contents('php://input'), true);
$username = trim($body['username'] ?? '');
$password = $body['password']      ?? '';

$pdo  = getConnexion();
$stmt = $pdo->prepare('SELECT id, password, role FROM users WHERE username = ?');
$stmt->execute([$username]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid credentials']);
    exit;
}

$token = jwtCreate(['sub' => $user['id'], 'username' => $username, 'role' => $user['role']]);
setcookie('token', $token, [
    'httponly' => true,
    'samesite' => 'Lax',
    'path'     => '/',
    'expires'  => time() + 86400 * 7,
]);

echo json_encode(['id' => $user['id'], 'username' => $username, 'role' => $user['role']]);
