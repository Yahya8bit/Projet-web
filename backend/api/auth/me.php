<?php
require_once __DIR__ . '/../../../db.php';
require_once __DIR__ . '/../../../jwt.php';

header('Content-Type: application/json');

$claims = jwtFromRequest();
if (!$claims) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthenticated']);
    exit;
}

$stmt = getConnexion()->prepare(
    'SELECT id, username, gender, birthdate, size, role FROM users WHERE id = ?'
);
$stmt->execute([$claims['sub']]);
$user = $stmt->fetch();

if (!$user) {
    http_response_code(404);
    echo json_encode(['error' => 'User not found']);
    exit;
}

echo json_encode($user);
