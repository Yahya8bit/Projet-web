<?php
require_once __DIR__ . '/../../db.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$stmt = getConnexion()->query(
    'SELECT id, nom, pays, annee_fond, logo, description FROM marques ORDER BY nom'
);
echo json_encode($stmt->fetchAll());
