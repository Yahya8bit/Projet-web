<?php
/**
 * G&Y Sole — Traitement du formulaire questionnaire (INSERT avis)
 * Membres : Yahia, Ghafer
 * Fichier  : questionnaire_traitement.php
 */

require_once 'db.php';
$pdo = getConnexion();

$errors  = [];
$success = false;
$data    = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // ---- Récupération ----
    $nom         = trim($_POST['nom']         ?? '');
    $email       = trim($_POST['email']       ?? '');
    $note        = (int)($_POST['note']       ?? 0);
    $experience  = trim($_POST['qExperience'] ?? '');
    $newsletter  = isset($_POST['newsletter']) ? 1 : 0;
    $commentaire = trim($_POST['commentaire'] ?? '');

    // ---- Revalidation PHP ----
    if (strlen($nom) < 2) {
        $errors[] = 'Le nom doit contenir au moins 2 caractères.';
    }
    $regexEmail = '/^[^\s@]+@[^\s@]+\.[^\s@]+$/';
    if (!preg_match($regexEmail, $email)) {
        $errors[] = 'Adresse e-mail invalide.';
    }
    if ($note < 1 || $note > 5) {
        $errors[] = 'La note doit être entre 1 et 5.';
    }
    $experiencesValides = ['tres_satisfait', 'satisfait', 'insatisfait'];
    if (!in_array($experience, $experiencesValides)) {
        $errors[] = 'Veuillez choisir votre niveau de satisfaction.';
    }
    if (strlen($commentaire) < 10) {
        $errors[] = 'Le commentaire doit faire au moins 10 caractères.';
    }

    // ---- Insertion si pas d'erreur ----
    if (empty($errors)) {
        // prepare() + execute() paramètres NOMMÉS
        $stmt = $pdo->prepare(
            'INSERT INTO avis (nom, email, note, experience, newsletter, commentaire)
             VALUES (:nom, :email, :note, :experience, :newsletter, :commentaire)'
        );
        $stmt->execute([
            ':nom'         => htmlspecialchars($nom),
            ':email'       => $email,
            ':note'        => $note,
            ':experience'  => $experience,
            ':newsletter'  => $newsletter,
            ':commentaire' => htmlspecialchars($commentaire),
        ]);
        $success = true;
        $data = compact('nom','email','note','experience','newsletter','commentaire');
    }
}

// Chargement de tous les avis — fetchAll()
$tousAvis = $pdo->query('SELECT * FROM avis ORDER BY date_avis DESC')->fetchAll();

// Labels lisibles
$expLabels = [
    'tres_satisfait' => '😊 Très satisfait',
    'satisfait'      => '🙂 Satisfait',
    'insatisfait'    => '😞 Insatisfait',
];
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Questionnaire — G&Y Sole</title>
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
    <h1>Questionnaire de satisfaction</h1>

    <?php if ($success): ?>
    <div class="content-block" style="border-left:4px solid #4caf50;">
        <p style="color:#4caf50; font-weight:bold;">✔ Merci <?= htmlspecialchars($data['nom']) ?>, votre avis a été enregistré !</p>
        <table style="margin-top:12px;">
            <tr><th>Nom</th><td><?= htmlspecialchars($data['nom']) ?></td></tr>
            <tr><th>Email</th><td><?= htmlspecialchars($data['email']) ?></td></tr>
            <tr><th>Note</th><td><?= str_repeat('⭐', $data['note']) ?> (<?= $data['note'] ?>/5)</td></tr>
            <tr><th>Expérience</th><td><?= $expLabels[$data['experience']] ?? $data['experience'] ?></td></tr>
            <tr><th>Newsletter</th><td><?= $data['newsletter'] ? 'Oui' : 'Non' ?></td></tr>
            <tr><th>Commentaire</th><td><?= htmlspecialchars($data['commentaire']) ?></td></tr>
        </table>
    </div>
    <?php endif; ?>

    <?php if (!empty($errors)): ?>
    <div class="content-block" style="border-left:4px solid #f44336;">
        <ul style="color:#f44336;">
            <?php foreach ($errors as $e): ?><li><?= htmlspecialchars($e) ?></li><?php endforeach; ?>
        </ul>
    </div>
    <?php endif; ?>

    <!-- Formulaire -->
    <section class="content-block">
        <form method="POST" action="questionnaire_traitement.php" onsubmit="return validerQuestionnaire()">

            <div class="form-group">
                <label for="nom">Nom *</label>
                <input type="text" id="nom" name="nom" placeholder="Votre nom">
                <span id="errNom" style="color:#f44336;font-size:.85em;"></span>
            </div>

            <div class="form-group">
                <label for="email">Email *</label>
                <input type="email" id="email" name="email" placeholder="vous@exemple.com">
                <span id="errEmail" style="color:#f44336;font-size:.85em;"></span>
            </div>

            <div class="form-group">
                <label for="note">Note globale *</label>
                <select id="note" name="note">
                    <option value="">— Choisir —</option>
                    <option value="5">5 - Excellent</option>
                    <option value="4">4 - Très bien</option>
                    <option value="3">3 - Bien</option>
                    <option value="2">2 - Moyen</option>
                    <option value="1">1 - Insuffisant</option>
                </select>
                <span id="errNote" style="color:#f44336;font-size:.85em;"></span>
            </div>

            <div class="form-group">
                <span>Expérience *</span><br>
                <label><input type="radio" name="qExperience" value="tres_satisfait"> Très satisfait</label><br>
                <label><input type="radio" name="qExperience" value="satisfait"> Satisfait</label><br>
                <label><input type="radio" name="qExperience" value="insatisfait"> Insatisfait</label>
                <span id="errExperience" style="color:#f44336;font-size:.85em;display:block;"></span>
            </div>

            <div class="form-group">
                <label><input type="checkbox" name="newsletter"> Je souhaite recevoir des offres</label>
            </div>

            <div class="form-group">
                <label for="commentaire">Commentaire * (min 10 car.)</label>
                <textarea id="commentaire" name="commentaire" rows="5" placeholder="Vos remarques..."></textarea>
                <span id="errCommentaire" style="color:#f44336;font-size:.85em;"></span>
            </div>

            <button type="submit">Envoyer</button>
        </form>
    </section>

    <!-- Tableau de tous les avis -->
    <section class="content-block">
        <h2>Tous les avis (<?= count($tousAvis) ?>)</h2>
        <?php if (empty($tousAvis)): ?>
            <p>Aucun avis pour l'instant.</p>
        <?php else: ?>
        <table>
            <thead>
                <tr><th>Nom</th><th>Note</th><th>Expérience</th><th>Commentaire</th><th>Date</th></tr>
            </thead>
            <tbody>
            <?php foreach ($tousAvis as $a): ?>
                <tr>
                    <td><?= htmlspecialchars($a['nom']) ?></td>
                    <td><?= str_repeat('⭐', (int)$a['note']) ?></td>
                    <td><?= $expLabels[$a['experience']] ?? $a['experience'] ?></td>
                    <td><?= htmlspecialchars($a['commentaire']) ?></td>
                    <td><?= $a['date_avis'] ?></td>
                </tr>
            <?php endforeach; ?>
            </tbody>
        </table>
        <?php endif; ?>
    </section>
</main>

<footer><p>© 2026 G&amp;Y Sole</p></footer>

<script>
function validerQuestionnaire() {
    let valide = true;
    function setErr(id, msg) {
        document.getElementById(id).innerText = msg;
        if (msg) valide = false;
    }

    // Nom : min 2 caractères
    const nom = document.getElementById('nom').value.trim();
    setErr('errNom', nom.length < 2 ? 'Le nom doit contenir au moins 2 caractères.' : '');

    // Email : regex
    const email = document.getElementById('email').value.trim();
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setErr('errEmail', !regexEmail.test(email) ? 'Adresse e-mail invalide.' : '');

    // Note : sélection obligatoire
    const note = document.getElementById('note').value;
    setErr('errNote', note === '' ? 'Veuillez choisir une note.' : '');

    // Radio expérience
    const radios = document.getElementsByName('qExperience');
    let radioOk = false;
    for (let r of radios) { if (r.checked) { radioOk = true; break; } }
    setErr('errExperience', !radioOk ? 'Veuillez choisir votre niveau de satisfaction.' : '');

    // Commentaire : min 10 car.
    const commentaire = document.getElementById('commentaire').value.trim();
    setErr('errCommentaire', commentaire.length < 10 ? 'Commentaire trop court (min 10 car.).' : '');

    return valide;
}
</script>
</body>
</html>
