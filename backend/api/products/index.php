<?php
require_once __DIR__ . '/../../db.php';

header('Content-Type: application/json');

$pdo = getConnexion();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $where  = ['1=1'];
    $params = [];

    if (!empty($_GET['collection'])) {
        $where[]  = 'p.collection = ?';
        $params[] = $_GET['collection'];
    }
    if (!empty($_GET['marque_id'])) {
        $where[]  = 'p.marque_id = ?';
        $params[] = (int)$_GET['marque_id'];
    }
    if (!empty($_GET['brand'])) {
        $where[]  = 'm.nom = ?';
        $params[] = $_GET['brand'];
    }
    if (!empty($_GET['type'])) {
        $where[]  = 'p.type = ?';
        $params[] = $_GET['type'];
    }
    if (!empty($_GET['prix_max'])) {
        $where[]  = 'p.prix <= ?';
        $params[] = (float)$_GET['prix_max'];
    }
    if (!empty($_GET['search'])) {
        $where[]  = '(p.modele LIKE ? OR m.nom LIKE ? OR p.type LIKE ?)';
        $term     = '%' . $_GET['search'] . '%';
        $params[] = $term;
        $params[] = $term;
        $params[] = $term;
    }

    $sql  = 'SELECT p.id, p.collection, m.nom AS marque, m.id AS marque_id,
                    p.modele, p.type, p.prix, p.photo, p.disponible
             FROM produits p
             JOIN marques m ON m.id = p.marque_id
             WHERE ' . implode(' AND ', $where) . '
             ORDER BY p.id';

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    echo json_encode($stmt->fetchAll());
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_once __DIR__ . '/../../auth_guard.php';
    requireAdmin();

    $body     = json_decode(file_get_contents('php://input'), true);
    $required = ['collection', 'marque_id', 'modele', 'type', 'prix', 'photo'];

    foreach ($required as $field) {
        if (empty($body[$field])) {
            http_response_code(422);
            echo json_encode(['error' => "Missing field: $field"]);
            exit;
        }
    }
    if (!in_array($body['collection'], ['Men', 'Women', 'Kids'])) {
        http_response_code(422);
        echo json_encode(['error' => 'Invalid collection']);
        exit;
    }
    if ((float)$body['prix'] <= 0) {
        http_response_code(422);
        echo json_encode(['error' => 'Prix must be positive']);
        exit;
    }

    $stmt = $pdo->prepare(
        'INSERT INTO produits (collection, marque_id, modele, type, prix, photo, disponible)
         VALUES (?, ?, ?, ?, ?, ?, 1)'
    );
    $stmt->execute([
        $body['collection'],
        (int)$body['marque_id'],
        $body['modele'],
        $body['type'],
        (float)$body['prix'],
        $body['photo'],
    ]);

    http_response_code(201);
    echo json_encode(['id' => (int)$pdo->lastInsertId()]);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
