<?php
require_once __DIR__ . '/jwt.php';

function requireAuth(): array
{
    $claims = jwtFromRequest();
    if (!$claims) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthenticated']);
        exit;
    }
    return $claims;
}

function requireAdmin(): array
{
    $claims = requireAuth();
    if ($claims['role'] !== 'admin') {
        http_response_code(403);
        echo json_encode(['error' => 'Forbidden']);
        exit;
    }
    return $claims;
}
