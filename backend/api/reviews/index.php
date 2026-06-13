<?php
require_once __DIR__ . '/../../db.php';

header('Content-Type: application/json');

$pdo = getConnexion();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->query(
        'SELECT id, nom, note, experience, commentaire, date_avis
         FROM avis
         ORDER BY date_avis DESC
         LIMIT 20'
    );
    echo json_encode($stmt->fetchAll());
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body        = json_decode(file_get_contents('php://input'), true);
    $nom         = trim($body['nom']         ?? '');
    $email       = trim($body['email']       ?? '');
    $note        = (int)($body['note']       ?? 0);
    $experience  = $body['experience']       ?? '';
    $newsletter  = (int)($body['newsletter'] ?? 0);
    $commentaire = trim($body['commentaire'] ?? '');

    $errors = [];
    if (strlen($nom) < 2)
        $errors[] = 'Name is required';
    if (!filter_var($email, FILTER_VALIDATE_EMAIL))
        $errors[] = 'Invalid email address';
    if ($note < 1 || $note > 5)
        $errors[] = 'Rating must be between 1 and 5';
    if (!in_array($experience, ['tres_satisfait', 'satisfait', 'insatisfait']))
        $errors[] = 'Invalid experience value';
    if (strlen($commentaire) < 5)
        $errors[] = 'Comment is too short';

    if ($errors) {
        http_response_code(422);
        echo json_encode(['errors' => $errors]);
        exit;
    }

    $stmt = $pdo->prepare(
        'INSERT INTO avis (nom, email, note, experience, newsletter, commentaire)
         VALUES (?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([$nom, $email, $note, $experience, $newsletter, $commentaire]);

    http_response_code(201);
    echo json_encode(['id' => (int)$pdo->lastInsertId()]);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
