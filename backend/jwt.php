<?php
define('JWT_SECRET', 'gysole_dev_secret_change_in_prod');

function base64url_encode(string $data): string
{
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64url_decode(string $data): string
{
    return base64_decode(strtr($data, '-_', '+/') . str_repeat('=', (4 - strlen($data) % 4) % 4));
}

function jwtCreate(array $payload): string
{
    $header  = base64url_encode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
    $payload = base64url_encode(json_encode(
        $payload + ['iat' => time(), 'exp' => time() + 86400 * 7]
    ));
    $sig = base64url_encode(hash_hmac('sha256', "$header.$payload", JWT_SECRET, true));
    return "$header.$payload.$sig";
}

function jwtVerify(string $token): array|false
{
    $parts = explode('.', $token);
    if (count($parts) !== 3) return false;
    [$header, $payload, $sig] = $parts;
    $expected = base64url_encode(hash_hmac('sha256', "$header.$payload", JWT_SECRET, true));
    if (!hash_equals($expected, $sig)) return false;
    $data = json_decode(base64url_decode($payload), true);
    if (!$data || $data['exp'] < time()) return false;
    return $data;
}

function jwtFromRequest(): array|false
{
    $token = $_COOKIE['token'] ?? null;
    if (!$token) return false;
    return jwtVerify($token);
}
