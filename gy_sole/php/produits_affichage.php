<?php
/**
 * G&Y Sole — Classe ProduitChaussure + affichage PHP
 * Membres : Yahia, Ghafer
 * Fichier  : produits_affichage.php
 *
 * Démo de la Partie 3 :
 *  - Classe avec attributs, constructeur, getters, setters, méthode
 *  - Tableau d'objets
 *  - Fonction d'itération + affichage HTML
 */

require_once 'db.php';

/* ============================================================
 * CLASSE ProduitChaussure
 * Représente un enregistrement de la table `produits`
 * ============================================================ */
class ProduitChaussure
{
    // Attributs privés
    private int    $id;
    private string $collection;
    private string $marque;
    private string $modele;
    private string $type;
    private float  $prix;
    private string $photo;
    private bool   $disponible;

    // Constructeur
    public function __construct(
        int    $id,
        string $collection,
        string $marque,
        string $modele,
        string $type,
        float  $prix,
        string $photo,
        bool   $disponible = true
    ) {
        $this->id          = $id;
        $this->collection  = $collection;
        $this->marque      = $marque;
        $this->modele      = $modele;
        $this->type        = $type;
        $this->prix        = $prix;
        $this->photo       = $photo;
        $this->disponible  = $disponible;
    }

    // ---- Getters ----
    public function getId(): int          { return $this->id; }
    public function getCollection(): string { return $this->collection; }
    public function getMarque(): string   { return $this->marque; }
    public function getModele(): string   { return $this->modele; }
    public function getType(): string     { return $this->type; }
    public function getPrix(): float      { return $this->prix; }
    public function getPhoto(): string    { return $this->photo; }
    public function isDisponible(): bool  { return $this->disponible; }

    // ---- Setters ----
    public function setCollection(string $c): void { $this->collection = $c; }
    public function setMarque(string $m): void      { $this->marque     = $m; }
    public function setModele(string $m): void      { $this->modele     = $m; }
    public function setType(string $t): void        { $this->type       = $t; }
    public function setPrix(float $p): void {
        if ($p <= 0) throw new InvalidArgumentException('Le prix doit être positif.');
        $this->prix = $p;
    }
    public function setDisponible(bool $d): void    { $this->disponible = $d; }

    // ---- Méthode métier ----
    /** Retourne une étiquette lisible pour le badge de disponibilité */
    public function badgeDisponibilite(): string
    {
        return $this->disponible
            ? '<span style="color:#4caf50;">✔ En stock</span>'
            : '<span style="color:#f44336;">✘ Rupture</span>';
    }

    /** Retourne le prix formaté en DT */
    public function prixFormate(): string
    {
        return number_format($this->prix, 2, ',', ' ') . ' DT';
    }
}

/* ============================================================
 * FONCTION afficherTableauProduits
 * Itère sur un tableau d'objets ProduitChaussure et produit
 * un tableau HTML structuré.
 * ============================================================ */
function afficherTableauProduits(array $produits): void
{
    if (empty($produits)) {
        echo '<p>Aucun produit à afficher.</p>';
        return;
    }

    echo '<table>';
    echo '<thead><tr>
            <th>#</th>
            <th>Photo</th>
            <th>Collection</th>
            <th>Marque</th>
            <th>Modèle</th>
            <th>Type</th>
            <th>Prix</th>
            <th>Disponibilité</th>
          </tr></thead>';
    echo '<tbody>';

    foreach ($produits as $p) {
        // Sélection : mettre en évidence les produits Running
        $rowClass = ($p->getType() === 'Running') ? ' class="highlight-category"' : '';

        echo '<tr' . $rowClass . '>';
        echo '<td>' . $p->getId() . '</td>';
        echo '<td><img src="../img/' . htmlspecialchars($p->getPhoto()) . '" alt="' . htmlspecialchars($p->getModele()) . '" style="height:50px;object-fit:cover;border-radius:4px;"></td>';
        echo '<td>' . htmlspecialchars($p->getCollection()) . '</td>';
        echo '<td>' . htmlspecialchars($p->getMarque()) . '</td>';
        echo '<td>' . htmlspecialchars($p->getModele()) . '</td>';
        echo '<td>' . htmlspecialchars($p->getType()) . '</td>';
        echo '<td>' . $p->prixFormate() . '</td>';
        echo '<td>' . $p->badgeDisponibilite() . '</td>';
        echo '</tr>';
    }

    echo '</tbody></table>';
}

/* ============================================================
 * CHARGEMENT : construire le tableau d'objets depuis la BDD
 * Utilise query() + fetchAll() — méthode simple sans paramètre
 * ============================================================ */
$pdo  = getConnexion();
$stmt = $pdo->query(
    'SELECT p.id, p.collection, m.nom AS marque, p.modele, p.type, p.prix, p.photo, p.disponible
     FROM produits p
     JOIN marques m ON m.id = p.marque_id
     ORDER BY p.id'
);
$rows = $stmt->fetchAll();   // fetchAll() — tableau associatif

// Construction du tableau d'objets ProduitChaussure
$catalogue = [];
foreach ($rows as $row) {
    $catalogue[] = new ProduitChaussure(
        (int)$row['id'],
        $row['collection'],
        $row['marque'],
        $row['modele'],
        $row['type'],
        (float)$row['prix'],
        $row['photo'],
        (bool)$row['disponible']
    );
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Catalogue — G&Y Sole</title>
    <link rel="stylesheet" href="../css/style.css">
    <style>
        .highlight-category { background-color:#3d2f0f; color:#d4af37; }
    </style>
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
    <h1>Catalogue des Produits</h1>
    <section class="content-block">
        <h2>Tous les produits</h2>
        <?php afficherTableauProduits($catalogue); ?>
    </section>
</main>

<footer><p>© 2026 G&amp;Y Sole</p></footer>
</body>
</html>
