<?php
/**
 * G&Y Sole — Insertion d'un produit (INSERT)
 * Membres : Yahia, Ghafer
 * Fichier  : produits_insert.php
 */

require_once 'db.php';
$pdo = getConnexion();

$errors  = [];
$success = false;

// Chargement des marques pour le <select> — utilise query() simple
$marques = $pdo->query('SELECT id, nom FROM marques ORDER BY nom')->fetchAll();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // ---- Récupération et nettoyage ----
    $collection = trim($_POST['collection'] ?? '');
    $marque_id  = (int)($_POST['marque_id']  ?? 0);
    $modele     = trim($_POST['modele']      ?? '');
    $type       = trim($_POST['type']        ?? '');
    $prix       = trim($_POST['prix']        ?? '');
    $photo      = trim($_POST['photo']       ?? '');
    $disponible = isset($_POST['disponible']) ? 1 : 0;

    // ---- Revalidation PHP (côté serveur) ----
    $collectionsValides = ['Men', 'Women', 'Kids'];
    if (!in_array($collection, $collectionsValides)) {
        $errors[] = 'Collection invalide.';
    }
    if ($marque_id <= 0) {
        $errors[] = 'Veuillez sélectionner une marque.';
    }
    if (strlen($modele) < 2 || strlen($modele) > 150) {
        $errors[] = 'Le modèle doit contenir entre 2 et 150 caractères.';
    }
    if (strlen($type) < 2) {
        $errors[] = 'Le type doit contenir au moins 2 caractères.';
    }
    if (!is_numeric($prix) || (float)$prix <= 0) {
        $errors[] = 'Le prix doit être un nombre positif.';
    }
    if (strlen($photo) < 3) {
        $errors[] = 'Le nom du fichier photo est requis.';
    }

    if (empty($errors)) {
        // Utilisation de prepare() + execute() avec paramètres POSITIONNELS (?  )
        $stmt = $pdo->prepare(
            'INSERT INTO produits (collection, marque_id, modele, type, prix, photo, disponible)
             VALUES (?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([$collection, $marque_id, $modele, $type, (float)$prix, $photo, $disponible]);
        $success = true;
    }
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Ajouter un produit — G&Y Sole</title>
    <link rel="stylesheet" href="../css/style.css">
</head>
<body>
<header class="navbar">
    <div id="logo"><img src="../img/noir.jpg" alt="G&amp;Y Sole Logo" class="logo"></div>
    <nav>
        <a href="../index.html">Home</a>
        <a href="products.html">Products</a>
        <a href="produits_recherche.php">Recherche</a>
        <a href="produits_insert.php">Ajouter</a>
    </nav>
</header>

<main class="container">
    <h1>Ajouter un produit</h1>

    <?php if ($success): ?>
        <div class="content-block" style="border-left:4px solid #4caf50;">
            <p style="color:#4caf50;">✔ Produit ajouté avec succès ! <a href="produits_recherche.php">Voir le catalogue</a></p>
        </div>
    <?php endif; ?>

    <?php if (!empty($errors)): ?>
        <div class="content-block" style="border-left:4px solid #f44336;">
            <ul style="color:#f44336;">
                <?php foreach ($errors as $e): ?>
                    <li><?= htmlspecialchars($e) ?></li>
                <?php endforeach; ?>
            </ul>
        </div>
    <?php endif; ?>

    <section class="content-block">
        <form method="POST" action="produits_insert.php" onsubmit="return validerFormulaireProduit()">

            <div class="form-group">
                <label for="collection">Collection *</label>
                <select id="collection" name="collection">
                    <option value="">— Choisir —</option>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Kids">Kids</option>
                </select>
                <span id="errCollection" style="color:#f44336;font-size:.85em;"></span>
            </div>

            <div class="form-group">
                <label for="marque_id">Marque *</label>
                <select id="marque_id" name="marque_id">
                    <option value="">— Choisir —</option>
                    <?php foreach ($marques as $m): ?>
                        <option value="<?= $m['id'] ?>"><?= htmlspecialchars($m['nom']) ?></option>
                    <?php endforeach; ?>
                </select>
                <span id="errMarque" style="color:#f44336;font-size:.85em;"></span>
            </div>

            <div class="form-group">
                <label for="modele">Modèle * (2–150 car.)</label>
                <input type="text" id="modele" name="modele" minlength="2" maxlength="150"
                       placeholder="Ex : Air Max 90">
                <span id="errModele" style="color:#f44336;font-size:.85em;"></span>
            </div>

            <div class="form-group">
                <label for="type">Type *</label>
                <input type="text" id="type" name="type" placeholder="Ex : Running">
                <span id="errType" style="color:#f44336;font-size:.85em;"></span>
            </div>

            <div class="form-group">
                <label for="prix">Prix (DT) *</label>
                <input type="number" id="prix" name="prix" min="0.01" step="0.01"
                       placeholder="Ex : 149.99">
                <span id="errPrix" style="color:#f44336;font-size:.85em;"></span>
            </div>

            <div class="form-group">
                <label for="photo">Fichier photo *</label>
                <input type="text" id="photo" name="photo" placeholder="Ex : nike.jpg">
                <span id="errPhoto" style="color:#f44336;font-size:.85em;"></span>
            </div>

            <div class="form-group">
                <label>
                    <input type="checkbox" name="disponible" checked>
                    Disponible en stock
                </label>
            </div>

            <button type="submit">➕ Ajouter le produit</button>
        </form>
    </section>
</main>

<footer><p>© 2026 G&amp;Y Sole</p></footer>

<script>
function validerFormulaireProduit() {
    let valide = true;

    // Helper : affiche/efface un message d'erreur
    function setErr(id, msg) {
        document.getElementById(id).innerText = msg;
        if (msg) valide = false;
    }

    // Collection obligatoire
    setErr('errCollection',
        document.getElementById('collection').value === '' ? 'Veuillez choisir une collection.' : '');

    // Marque obligatoire
    setErr('errMarque',
        document.getElementById('marque_id').value === '' ? 'Veuillez choisir une marque.' : '');

    // Modèle : min 2 caractères
    const modele = document.getElementById('modele').value.trim();
    setErr('errModele',
        modele.length < 2 ? 'Le modèle doit contenir au moins 2 caractères.' : '');

    // Type obligatoire
    const type = document.getElementById('type').value.trim();
    setErr('errType', type === '' ? 'Le type est obligatoire.' : '');

    // Prix : nombre positif
    const prix = parseFloat(document.getElementById('prix').value);
    setErr('errPrix',
        (isNaN(prix) || prix <= 0) ? 'Entrez un prix positif valide.' : '');

    // Photo : extension image via regex
    const photo = document.getElementById('photo').value.trim();
    const regexPhoto = /^.+\.(jpg|jpeg|png|webp|gif)$/i;
    setErr('errPhoto',
        !regexPhoto.test(photo) ? 'Nom de fichier invalide (ex: photo.jpg).' : '');

    return valide;
}
</script>
</body>
</html>
