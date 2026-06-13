<?php
require_once __DIR__ . '/../../db.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$body    = json_decode(file_get_contents('php://input'), true);
$nom     = trim($body['nom']     ?? '');
$email   = trim($body['email']   ?? '');
$message = trim($body['message'] ?? '');

$errors = [];
if (strlen($nom) < 2)
    $errors[] = 'Name is required';
if (!filter_var($email, FILTER_VALIDATE_EMAIL))
    $errors[] = 'Invalid email address';
if (strlen($message) < 10)
    $errors[] = 'Message must be at least 10 characters';

if ($errors) {
    http_response_code(422);
    echo json_encode(['errors' => $errors]);
    exit;
}

echo json_encode(['ok' => true]);
