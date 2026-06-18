<?php
/**
 * G&Y Sole — Suppression d'un produit (DELETE)
 * Membres : Yahia, Ghafer
 * Fichier  : produits_delete.php
 */

require_once 'db.php';
$pdo = getConnexion();

$message = '';
$type_msg = '';
$produit  = null;

// Récupération sécurisée de l'ID
$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

// ---- Chargement du produit à supprimer (SELECT + fetch() unique) ----
if ($id > 0) {
    $stmt = $pdo->prepare(
        'SELECT p.*, m.nom AS marque
         FROM produits p
         JOIN marques m ON m.id = p.marque_id
         WHERE p.id = ?'
    );
    $stmt->execute([$id]);
    $produit = $stmt->fetch();   // fetch() — une seule ligne
}

// ---- Traitement de la suppression (POST de confirmation) ----
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['confirmer'])) {
    $idSupp = (int)($_POST['id'] ?? 0);

    if ($idSupp <= 0) {
        $message  = 'ID invalide.';
        $type_msg = 'erreur';
    } else {
        // exec() — pour les requêtes sans résultat à lire
        $nb = $pdo->exec('DELETE FROM produits WHERE id = ' . $idSupp);

        if ($nb > 0) {
            $message  = 'Produit supprimé avec succès.';
            $type_msg = 'succes';
            $produit  = null;
        } else {
            $message  = 'Aucun produit trouvé avec cet ID.';
            $type_msg = 'erreur';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Supprimer un produit — G&Y Sole</title>
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
    <h1>Supprimer un produit</h1>

    <?php if ($message): ?>
        <div class="content-block" style="border-left:4px solid <?= $type_msg === 'succes' ? '#4caf50' : '#f44336' ?>;">
            <p style="color:<?= $type_msg === 'succes' ? '#4caf50' : '#f44336' ?>;">
                <?= htmlspecialchars($message) ?>
                <?php if ($type_msg === 'succes'): ?>
                    — <a href="produits_recherche.php">Retour au catalogue</a>
                <?php endif; ?>
            </p>
        </div>
    <?php endif; ?>

    <!-- Formulaire de recherche par ID -->
    <section class="content-block">
        <h2>Rechercher un produit par ID</h2>
        <form method="GET" action="produits_delete.php">
            <div class="form-group">
                <label for="id">ID du produit</label>
                <input type="number" id="id" name="id" min="1"
                       value="<?= $id > 0 ? $id : '' ?>"
                       placeholder="Ex : 3">
            </div>
            <button type="submit">🔍 Rechercher</button>
        </form>
    </section>

    <!-- Fiche de confirmation avant suppression -->
    <?php if ($produit): ?>
    <section class="content-block" style="border:2px solid #8b0000;">
        <h2 style="color:#f44336;">⚠️ Confirmer la suppression</h2>
        <table>
            <tr><th>ID</th><td><?= $produit['id'] ?></td></tr>
            <tr><th>Marque</th><td><?= htmlspecialchars($produit['marque']) ?></td></tr>
            <tr><th>Modèle</th><td><?= htmlspecialchars($produit['modele']) ?></td></tr>
            <tr><th>Collection</th><td><?= htmlspecialchars($produit['collection']) ?></td></tr>
            <tr><th>Prix</th><td><?= number_format($produit['prix'],2,',',' ') ?> DT</td></tr>
            <tr><th>Photo</th><td><img src="../img/<?= htmlspecialchars($produit['photo']) ?>" style="height:60px;object-fit:cover;" alt=""></td></tr>
        </table>

        <form method="POST" action="produits_delete.php" style="margin-top:16px;">
            <input type="hidden" name="id" value="<?= $produit['id'] ?>">
            <button type="submit" name="confirmer" style="background:#8b0000;color:#fff;margin-right:10px;">
                🗑 Confirmer la suppression
            </button>
            <a href="produits_recherche.php"><button type="button">Annuler</button></a>
        </form>
    </section>
    <?php elseif ($id > 0 && !$message): ?>
        <p style="color:#f44336;">Aucun produit trouvé avec l'ID <?= $id ?>.</p>
    <?php endif; ?>
</main>

<footer><p>© 2026 G&amp;Y Sole</p></footer>
</body>
</html>
