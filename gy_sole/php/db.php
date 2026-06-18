<?php
/**
 * G&Y Sole — Connexion PDO à la base de données
 * Membres : Yahia, Ghafer
 * Fichier  : db.php
 */

define('DB_HOST', 'localhost');
define('DB_NAME', 'gysole_db');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

/**
 * Retourne une instance PDO connectée à gysole_db.
 * Lève une PDOException si la connexion échoue.
 *
 * @return PDO
 */
function getConnexion(): PDO
{
    static $pdo = null;          // instance unique (singleton léger)

    if ($pdo === null) {
        $dsn = 'mysql:host=' . DB_HOST
             . ';dbname=' . DB_NAME
             . ';charset=' . DB_CHARSET;

        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];

        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            // En production, ne jamais afficher le message brut
            die('<p style="color:red;">Erreur de connexion : ' . htmlspecialchars($e->getMessage()) . '</p>');
        }
    }

    return $pdo;
}
?>
