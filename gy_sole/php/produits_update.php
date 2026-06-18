<?php
/**
 * G&Y Sole — Mise à jour d'un produit (UPDATE)
 * Membres : Yahia, Ghafer
 * Fichier  : produits_update.php
 */

require_once 'db.php';
$pdo = getConnexion();

$errors  = [];
$success = false;
$produit = null;

$id = isset($_GET['id']) ? (int)$_GET['id'] : (int)($_POST['id'] ?? 0);

// Chargement des marques — query() sans paramètre
$marques = $pdo->query('SELECT id, nom FROM marques ORDER BY nom')->fetchAll();

// Chargement du produit existant — prepare() + execute() + fetch()
if ($id > 0) {
    $stmt = $pdo->prepare(
        'SELECT p.*, m.nom AS marque_nom
         FROM produits p JOIN marques m ON m.id = p.marque_id
         WHERE p.id = :id'
    );
    $stmt->execute([':id' => $id]);
    $produit = $stmt->fetch();
}

// ---- Traitement du formulaire de mise à jour ----
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $produit) {

    $collection = trim($_POST['collection'] ?? '');
    $marque_id  = (int)($_POST['marque_id']  ?? 0);
    $modele     = trim($_POST['modele']      ?? '');
    $type       = trim($_POST['type']        ?? '');
    $prix       = trim($_POST['prix']        ?? '');
    $photo      = trim($_POST['photo']       ?? '');
    $disponible = isset($_POST['disponible']) ? 1 : 0;

    // ---- Revalidation PHP (côté serveur) ----
    if (!in_array($collection, ['Men','Women','Kids'])) $errors[] = 'Collection invalide.';
    if ($marque_id <= 0)                                $errors[] = 'Marque requise.';
    if (strlen($modele) < 2)                            $errors[] = 'Modèle trop court (min 2 car.).';
    if (strlen($type)   < 2)                            $errors[] = 'Type requis (min 2 car.).';
    if (!is_numeric($prix) || (float)$prix <= 0)        $errors[] = 'Prix positif requis.';
    if (strlen($photo)  < 3)                            $errors[] = 'Nom de photo requis.';

    if (empty($errors)) {
        // prepare() + execute() avec paramètres NOMMÉS
        $stmt = $pdo->prepare(
            'UPDATE produits
             SET collection = :collection,
                 marque_id  = :marque_id,
                 modele     = :modele,
                 type       = :type,
                 prix       = :prix,
                 photo      = :photo,
                 disponible = :disponible
             WHERE id = :id'
        );
        $stmt->execute([
            ':collection' => $collection,
            ':marque_id'  => $marque_id,
            ':modele'     => $modele,
            ':type'       => $type,
            ':prix'       => (float)$prix,
            ':photo'      => $photo,
            ':disponible' => $disponible,
            ':id'         => $id,
        ]);
        $success = true;
        // Recharger le produit mis à jour
        $stmt2 = $pdo->prepare('SELECT p.*, m.nom AS marque_nom FROM produits p JOIN marques m ON m.id=p.marque_id WHERE p.id=:id');
        $stmt2->execute([':id' => $id]);
        $produit = $stmt2->fetch();
    }
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Modifier un produit — G&Y Sole</title>
    <link rel="stylesheet" href="../css/style.css">
</head>
<body>
<header class="navbar">
    <div id="logo"><img src="../img/noir.jpg" alt="G&amp;Y Sole Logo" class="logo"></div>
    <nav>
        <a href="../index.html">Home</a>
        <a href="produits_recherche.php">Recherche</a>
        <a href="produits_insert.php">Ajouter</a>
    </nav>
</header>

<main class="container">
    <h1>Modifier un produit</h1>

    <!-- Recherche par ID si pas encore sélectionné -->
    <?php if (!$produit): ?>
    <section class="content-block">
        <h2>Entrer l'ID du produit à modifier</h2>
        <form method="GET" action="produits_update.php">
            <div class="form-group">
                <label for="id">ID du produit</label>
                <input type="number" id="id" name="id" min="1" placeholder="Ex : 1">
            </div>
            <button type="submit">Charger</button>
        </form>
        <?php if ($id > 0): ?>
            <p style="color:#f44336;">Aucun produit avec l'ID <?= $id ?>.</p>
        <?php endif; ?>
    </section>

    <?php else: ?>

    <?php if ($success): ?>
        <div class="content-block" style="border-left:4px solid #4caf50;">
            <p style="color:#4caf50;">✔ Produit mis à jour avec succès !</p>
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
        <h2>Modifier : <?= htmlspecialchars($produit['modele']) ?> (ID <?= $id ?>)</h2>

        <form method="POST" action="produits_update.php" onsubmit="return validerUpdate()">
            <input type="hidden" name="id" value="<?= $id ?>">

            <div class="form-group">
                <label for="collection">Collection *</label>
                <select id="collection" name="collection">
                    <?php foreach (['Men','Women','Kids'] as $c): ?>
                        <option value="<?= $c ?>" <?= $produit['collection'] === $c ? 'selected' : '' ?>><?= $c ?></option>
                    <?php endforeach; ?>
                </select>
            </div>

            <div class="form-group">
                <label for="marque_id">Marque *</label>
                <select id="marque_id" name="marque_id">
                    <?php foreach ($marques as $m): ?>
                        <option value="<?= $m['id'] ?>" <?= $produit['marque_id'] == $m['id'] ? 'selected' : '' ?>>
                            <?= htmlspecialchars($m['nom']) ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>

            <div class="form-group">
                <label for="modele">Modèle *</label>
                <input type="text" id="modele" name="modele"
                       value="<?= htmlspecialchars($produit['modele']) ?>" minlength="2" maxlength="150">
                <span id="errModele" style="color:#f44336;font-size:.85em;"></span>
            </div>

            <div class="form-group">
                <label for="type">Type *</label>
                <input type="text" id="type" name="type"
                       value="<?= htmlspecialchars($produit['type']) ?>">
                <span id="errType" style="color:#f44336;font-size:.85em;"></span>
            </div>

            <div class="form-group">
                <label for="prix">Prix (DT) *</label>
                <input type="number" id="prix" name="prix" min="0.01" step="0.01"
                       value="<?= $produit['prix'] ?>">
                <span id="errPrix" style="color:#f44336;font-size:.85em;"></span>
            </div>

            <div class="form-group">
                <label for="photo">Fichier photo *</label>
                <input type="text" id="photo" name="photo"
                       value="<?= htmlspecialchars($produit['photo']) ?>">
                <span id="errPhoto" style="color:#f44336;font-size:.85em;"></span>
            </div>

            <div class="form-group">
                <label>
                    <input type="checkbox" name="disponible" <?= $produit['disponible'] ? 'checked' : '' ?>>
                    Disponible en stock
                </label>
            </div>

            <button type="submit">💾 Enregistrer les modifications</button>
            <a href="produits_recherche.php"><button type="button" style="margin-left:10px;">Annuler</button></a>
        </form>
    </section>
    <?php endif; ?>
</main>

<footer><p>© 2026 G&amp;Y Sole</p></footer>

<script>
function validerUpdate() {
    let valide = true;
    function setErr(id, msg) {
        const el = document.getElementById(id);
        if (el) { el.innerText = msg; }
        if (msg) valide = false;
    }
    const modele = document.getElementById('modele').value.trim();
    setErr('errModele', modele.length < 2 ? 'Modèle requis (min 2 car.).' : '');

    const type = document.getElementById('type').value.trim();
    setErr('errType', type === '' ? 'Type obligatoire.' : '');

    const prix = parseFloat(document.getElementById('prix').value);
    setErr('errPrix', (isNaN(prix) || prix <= 0) ? 'Prix positif requis.' : '');

    const photo = document.getElementById('photo').value.trim();
    setErr('errPhoto', !/^.+\.(jpg|jpeg|png|webp|gif)$/i.test(photo) ? 'Extension invalide.' : '');

    return valide;
}
</script>
</body>
</html>
