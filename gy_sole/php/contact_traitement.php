<?php
/**
 * G&Y Sole — Traitement du formulaire Contact
 * Membres : Yahia, Ghafer
 * Fichier  : contact_traitement.php
 */

$errors  = [];
$success = false;
$data    = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name    = trim($_POST['name']    ?? '');
    $email   = trim($_POST['email']   ?? '');
    $message = trim($_POST['message'] ?? '');

    // Revalidation PHP
    if (strlen($name) < 2) {
        $errors[] = 'Le nom doit contenir au moins 2 caractères.';
    }
    if (!preg_match('/^[^\s@]+@[^\s@]+\.[^\s@]+$/', $email)) {
        $errors[] = 'Adresse e-mail invalide.';
    }
    if (strlen($message) < 10) {
        $errors[] = 'Le message doit contenir au moins 10 caractères.';
    }

    if (empty($errors)) {
        $success = true;
        $data = compact('name','email','message');
    }
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Contact — G&Y Sole</title>
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
    <h1>Nous contacter</h1>

    <?php if ($success): ?>
    <div class="content-block" style="border-left:4px solid #4caf50;">
        <p style="color:#4caf50; font-weight:bold;">✔ Message reçu, merci <?= htmlspecialchars($data['name']) ?> !</p>
        <table>
            <tr><th>Nom</th><td><?= htmlspecialchars($data['name']) ?></td></tr>
            <tr><th>Email</th><td><?= htmlspecialchars($data['email']) ?></td></tr>
            <tr><th>Message</th><td><?= nl2br(htmlspecialchars($data['message'])) ?></td></tr>
        </table>
        <p style="margin-top:12px;"><a href="contact.html">← Retour</a></p>
    </div>
    <?php else: ?>

    <?php if (!empty($errors)): ?>
    <div class="content-block" style="border-left:4px solid #f44336;">
        <ul style="color:#f44336;">
            <?php foreach ($errors as $e): ?><li><?= htmlspecialchars($e) ?></li><?php endforeach; ?>
        </ul>
    </div>
    <?php endif; ?>

    <section class="content-block">
        <form method="POST" action="contact_traitement.php" onsubmit="return validerContact()">
            <div class="form-group">
                <label for="name">Nom *</label>
                <input type="text" id="name" name="name"
                       value="<?= htmlspecialchars($_POST['name'] ?? '') ?>">
                <span id="errName" style="color:#f44336;font-size:.85em;"></span>
            </div>

            <div class="form-group">
                <label for="email">Email *</label>
                <input type="email" id="email" name="email"
                       value="<?= htmlspecialchars($_POST['email'] ?? '') ?>">
                <span id="errEmail" style="color:#f44336;font-size:.85em;"></span>
            </div>

            <div class="form-group">
                <label for="message">Message * (min 10 car.)</label>
                <textarea id="message" name="message" rows="5"><?= htmlspecialchars($_POST['message'] ?? '') ?></textarea>
                <span id="errMessage" style="color:#f44336;font-size:.85em;"></span>
            </div>

            <button type="submit">Envoyer</button>
        </form>
    </section>
    <?php endif; ?>
</main>

<footer><p>© 2026 G&amp;Y Sole</p></footer>

<script>
function validerContact() {
    let valide = true;
    function setErr(id, msg) {
        document.getElementById(id).innerText = msg;
        if (msg) valide = false;
    }

    const name = document.getElementById('name').value.trim();
    setErr('errName', name.length < 2 ? 'Nom obligatoire (min 2 car.).' : '');

    const email = document.getElementById('email').value.trim();
    setErr('errEmail', !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'Email invalide.' : '');

    const msg = document.getElementById('message').value.trim();
    setErr('errMessage', msg.length < 10 ? 'Message trop court (min 10 car.).' : '');

    return valide;
}
</script>
</body>
</html>
