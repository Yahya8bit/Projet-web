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
$username = trim($body['username']  ?? '');
$password = $body['password']       ?? '';
$gender   = $body['gender']         ?? '';
$birthdate= $body['birthdate']      ?? '';
$size     = (int)($body['size']     ?? 0);

$errors = [];
if (!preg_match('/^[A-Za-z0-9_]{3,20}$/', $username))
    $errors[] = 'Invalid username (3-20 chars, letters/numbers/_)';
if (!preg_match('/^(?=.*[A-Z])(?=.*\d).{8,}$/', $password))
    $errors[] = 'Password must be 8+ chars with at least one uppercase and one number';
if (!in_array($gender, ['male', 'female']))
    $errors[] = 'Invalid gender';
if (empty($birthdate) || strtotime($birthdate) >= time())
    $errors[] = 'Invalid birthdate';
if ($size < 30 || $size > 50)
    $errors[] = 'Shoe size must be between 30 and 50';

if ($errors) {
    http_response_code(422);
    echo json_encode(['errors' => $errors]);
    exit;
}

$pdo   = getConnexion();
$check = $pdo->prepare('SELECT id FROM users WHERE username = ?');
$check->execute([$username]);
if ($check->fetch()) {
    http_response_code(409);
    echo json_encode(['error' => 'Username already taken']);
    exit;
}

$hash = password_hash($password, PASSWORD_BCRYPT);
$stmt = $pdo->prepare(
    'INSERT INTO users (username, password, gender, birthdate, size) VALUES (?, ?, ?, ?, ?)'
);
$stmt->execute([$username, $hash, $gender, $birthdate, $size]);
$userId = (int)$pdo->lastInsertId();

$token = jwtCreate(['sub' => $userId, 'username' => $username, 'role' => 'user']);
setcookie('token', $token, [
    'httponly' => true,
    'samesite' => 'Lax',
    'path'     => '/',
    'expires'  => time() + 86400 * 7,
]);

http_response_code(201);
echo json_encode(['id' => $userId, 'username' => $username, 'role' => 'user']);
