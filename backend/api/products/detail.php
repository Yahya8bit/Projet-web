<?php
require_once __DIR__ . '/../../db.php';

header('Content-Type: application/json');

$id  = isset($_GET['id']) ? (int)$_GET['id'] : 0;
$pdo = getConnexion();

function getProduct(PDO $pdo, int $id): array|false
{
    $stmt = $pdo->prepare(
        'SELECT p.id, p.collection, m.nom AS marque, m.id AS marque_id,
                p.modele, p.type, p.prix, p.photo, p.disponible
         FROM produits p
         JOIN marques m ON m.id = p.marque_id
         WHERE p.id = ?'
    );
    $stmt->execute([$id]);
    return $stmt->fetch();
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $product = getProduct($pdo, $id);
    if (!$product) {
        http_response_code(404);
        echo json_encode(['error' => 'Not found']);
        exit;
    }
    echo json_encode($product);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    require_once __DIR__ . '/../../auth_guard.php';
    requireAdmin();

    $body    = json_decode(file_get_contents('php://input'), true);
    $allowed = ['collection', 'marque_id', 'modele', 'type', 'prix', 'photo', 'disponible'];
    $sets    = [];
    $params  = [];

    foreach ($allowed as $field) {
        if (isset($body[$field])) {
            $sets[]   = "$field = ?";
            $params[] = $body[$field];
        }
    }
    if (empty($sets)) {
        http_response_code(422);
        echo json_encode(['error' => 'No fields to update']);
        exit;
    }

    $params[] = $id;
    $pdo->prepare('UPDATE produits SET ' . implode(', ', $sets) . ' WHERE id = ?')
        ->execute($params);

    echo json_encode(getProduct($pdo, $id));
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    require_once __DIR__ . '/../../auth_guard.php';
    requireAdmin();

    $stmt = $pdo->prepare('DELETE FROM produits WHERE id = ?');
    $stmt->execute([$id]);

    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['error' => 'Not found']);
        exit;
    }
    http_response_code(204);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
