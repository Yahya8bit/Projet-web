<?php
/**
 * G&Y Sole — Recherche de produits (SELECT + fetch/fetchAll/fetchObject)
 * Membres : Yahia, Ghafer
 * Fichier  : produits_recherche.php
 */

require_once 'db.php';
$pdo = getConnexion();

$resultats  = [];
$recherche  = '';
$collection = '';
$prix_max   = '';
$searched   = false;

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['q'])) {
    $searched   = true;
    $recherche  = trim($_GET['q']  ?? '');
    $collection = trim($_GET['col'] ?? '');
    $prix_max   = trim($_GET['prix_max'] ?? '');

    // ---- Construction dynamique de la requête préparée (paramètres nommés) ----
    $sql    = 'SELECT p.id, p.collection, m.nom AS marque, p.modele, p.type,
                      p.prix, p.photo, p.disponible
               FROM produits p
               JOIN marques m ON m.id = p.marque_id
               WHERE 1=1';
    $params = [];

    if ($recherche !== '') {
        $sql .= ' AND (m.nom LIKE :q OR p.modele LIKE :q OR p.type LIKE :q)';
        $params[':q'] = '%' . $recherche . '%';
    }
    if ($collection !== '') {
        $sql .= ' AND p.collection = :col';
        $params[':col'] = $collection;
    }
    if ($prix_max !== '' && is_numeric($prix_max)) {
        $sql .= ' AND p.prix <= :prix_max';
        $params[':prix_max'] = (float)$prix_max;
    }
    $sql .= ' ORDER BY p.prix ASC';

    // Utilisation de prepare() + execute() avec paramètres nommés
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    // Démo des trois méthodes de récupération
    // fetchAll() — tous les résultats d'un coup
    $resultats = $stmt->fetchAll();

    // fetchObject() — démo sur la première ligne d'une requête séparée
    $stmtDemo = $pdo->prepare('SELECT p.*, m.nom AS marque FROM produits p JOIN marques m ON m.id=p.marque_id WHERE p.id = :id');
    $stmtDemo->execute([':id' => 1]);
    $objetDemo = $stmtDemo->fetchObject();   // retourne un stdClass
}

// Chargement des collections pour le filtre (query simple)
$collectionsDispos = ['Men', 'Women', 'Kids'];
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Recherche Produits — G&Y Sole</title>
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
    <h1>Recherche de Produits</h1>

    <section class="content-block">
        <h2>Filtres de recherche</h2>
        <form method="GET" action="produits_recherche.php">
            <div class="form-group">
                <label for="q">Mot-clé (marque, modèle, type)</label>
                <input type="text" id="q" name="q"
                       value="<?= htmlspecialchars($recherche) ?>"
                       placeholder="Ex : Nike, Running...">
            </div>
            <div class="form-group">
                <label for="col">Collection</label>
                <select id="col" name="col">
                    <option value="">— Toutes —</option>
                    <?php foreach ($collectionsDispos as $c): ?>
                        <option value="<?= $c ?>" <?= ($collection === $c) ? 'selected' : '' ?>><?= $c ?></option>
                    <?php endforeach; ?>
                </select>
            </div>
            <div class="form-group">
                <label for="prix_max">Prix max (DT)</label>
                <input type="number" id="prix_max" name="prix_max"
                       min="0" step="0.01"
                       value="<?= htmlspecialchars($prix_max) ?>"
                       placeholder="Ex : 150">
            </div>
            <button type="submit">🔍 Rechercher</button>
            <a href="produits_recherche.php"><button type="button">↺ Réinitialiser</button></a>
        </form>
    </section>

    <?php if ($searched): ?>
    <section class="content-block">
        <h2>Résultats (<?= count($resultats) ?> produit(s) trouvé(s))</h2>

        <?php if (empty($resultats)): ?>
            <p>Aucun produit ne correspond à votre recherche.</p>
        <?php else: ?>
        <table>
            <thead>
                <tr>
                    <th>#</th><th>Photo</th><th>Collection</th>
                    <th>Marque</th><th>Modèle</th><th>Type</th>
                    <th>Prix</th><th>Stock</th><th>Actions</th>
                </tr>
            </thead>
            <tbody>
            <?php foreach ($resultats as $row): ?>
                <tr>
                    <td><?= $row['id'] ?></td>
                    <td><img src="../img/<?= htmlspecialchars($row['photo']) ?>" style="height:45px;object-fit:cover;border-radius:4px;" alt=""></td>
                    <td><?= htmlspecialchars($row['collection']) ?></td>
                    <td><?= htmlspecialchars($row['marque']) ?></td>
                    <td><?= htmlspecialchars($row['modele']) ?></td>
                    <td><?= htmlspecialchars($row['type']) ?></td>
                    <td><?= number_format($row['prix'],2,',',' ') ?> DT</td>
                    <td><?= $row['disponible'] ? '✔' : '✘' ?></td>
                    <td>
                        <a href="produits_update.php?id=<?= $row['id'] ?>"><button type="button">✏️</button></a>
                        <a href="produits_delete.php?id=<?= $row['id'] ?>" onclick="return confirm('Supprimer ?')"><button type="button" style="background:#8b0000;color:#fff;">🗑</button></a>
                    </td>
                </tr>
            <?php endforeach; ?>
            </tbody>
        </table>
        <?php endif; ?>
    </section>
    <?php endif; ?>
</main>

<footer><p>© 2026 G&amp;Y Sole</p></footer>
</body>
</html>
