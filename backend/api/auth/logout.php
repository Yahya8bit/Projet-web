<?php
header('Content-Type: application/json');
setcookie('token', '', [
    'httponly' => true,
    'samesite' => 'Lax',
    'path'     => '/',
    'expires'  => time() - 1,
]);
echo json_encode(['ok' => true]);
