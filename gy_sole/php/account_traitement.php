<?php
/**
 * G&Y Sole — Traitement des formulaires Account (Login + Préférences)
 * Membres : Yahia, Ghafer
 * Fichier  : account_traitement.php
 */

$errors   = [];
$success  = false;
$formType = $_POST['form_type'] ?? 'login';
$data     = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    if ($formType === 'preferences') {
        // ---- Formulaire Préférences ----
        $brand   = trim($_POST['favoriteBrand'] ?? '');
        $comment = trim($_POST['comment']       ?? '');

        if ($brand === '') $errors[] = 'Marque favorite requise.';
        if (strlen($comment) < 5) $errors[] = 'Commentaire trop court (min 5 car.).';

        if (empty($errors)) {
            $success = true;
            $data = compact('brand','comment');
        }

    } else {
        // ---- Formulaire Login ----
        $username        = trim($_POST['username']        ?? '');
        $password        = $_POST['password']             ?? '';
        $confirmPassword = $_POST['confirmPassword']      ?? '';
        $gender          = trim($_POST['gender']          ?? '');
        $birthdate       = trim($_POST['birthdate']       ?? '');
        $size            = (int)($_POST['size']           ?? 0);
        $subscribe       = isset($_POST['subscribe']) ? 1 : 0;

        // Revalidation PHP
        if (!preg_match('/^[A-Za-z0-9_]{3,20}$/', $username)) {
            $errors[] = 'Username invalide (3–20 car., lettres/chiffres/_).';
        }
        if (!preg_match('/^(?=.*[A-Z])(?=.*\d).{8,}$/', $password)) {
            $errors[] = 'Mot de passe : min 8 car., 1 majuscule, 1 chiffre.';
        }
        if ($password !== $confirmPassword) {
            $errors[] = 'Les mots de passe ne correspondent pas.';
        }
        if (!in_array($gender, ['male','female'])) {
            $errors[] = 'Genre invalide.';
        }
        if (empty($birthdate) || strtotime($birthdate) >= time()) {
            $errors[] = 'Date de naissance invalide ou dans le futur.';
        }
        if ($size < 30 || $size > 50) {
            $errors[] = 'Pointure hors plage (30–50).';
        }

        if (empty($errors)) {
            $success = true;
            $data = compact('username','gender','birthdate','size','subscribe');
        }
    }
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Account — G&Y Sole</title>
    <link rel="stylesheet" href="../css/style.css">
</head>
<body>
<header class="navbar">
    <div id="logo"><img src="../img/noir.jpg" alt="G&amp;Y Sole Logo" class="logo"></div>
    <nav>
        <a href="../index.html">Home</a>
        <a href="products.html">Products</a>
        <a href="about.html">About</a>
        <a href="contact.html">Contact</a>
        <a href="account.html">Account</a>
    </nav>
</header>

<main class="container">
    <h1>Account</h1>

    <?php if (!empty($errors)): ?>
    <div class="content-block" style="border-left:4px solid #f44336;">
        <ul style="color:#f44336;">
            <?php foreach ($errors as $e): ?><li><?= htmlspecialchars($e) ?></li><?php endforeach; ?>
        </ul>
        <p><a href="account.html">← Retour au formulaire</a></p>
    </div>

    <?php elseif ($success && $formType === 'preferences'): ?>
    <div class="content-block" style="border-left:4px solid #4caf50;">
        <p style="color:#4caf50; font-weight:bold;">✔ Préférences enregistrées !</p>
        <table>
            <tr><th>Marque favorite</th><td><?= htmlspecialchars(ucfirst($data['brand'])) ?></td></tr>
            <tr><th>Commentaire</th><td><?= nl2br(htmlspecialchars($data['comment'])) ?></td></tr>
        </table>
    </div>

    <?php elseif ($success): ?>
    <div class="content-block" style="border-left:4px solid #4caf50;">
        <p style="color:#4caf50; font-weight:bold;">✔ Connexion réussie, bienvenue <?= htmlspecialchars($data['username']) ?> !</p>
        <table>
            <tr><th>Username</th><td><?= htmlspecialchars($data['username']) ?></td></tr>
            <tr><th>Genre</th><td><?= $data['gender'] === 'male' ? 'Male' : 'Female' ?></td></tr>
            <tr><th>Date de naissance</th><td><?= htmlspecialchars($data['birthdate']) ?></td></tr>
            <tr><th>Pointure</th><td><?= $data['size'] ?></td></tr>
            <tr><th>Newsletter</th><td><?= $data['subscribe'] ? 'Oui' : 'Non' ?></td></tr>
        </table>
    </div>
    <?php endif; ?>

    <p style="text-align:center; margin-top:20px;"><a href="account.html">← Retour</a></p>
</main>

<footer><p>© 2026 G&amp;Y Sole</p></footer>
</body>
</html>
