-- ============================================================
-- G&Y Sole — Script SQL complet
-- Membres : Yahia, Ghafer
-- ============================================================

CREATE DATABASE IF NOT EXISTS gysole_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gysole_db;

-- ============================================================
-- TABLE 1 : marques
-- Correspond à l'objet JavaScript : Brand/Marque
-- ============================================================
CREATE TABLE IF NOT EXISTS marques (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    nom         VARCHAR(100) NOT NULL UNIQUE,
    pays        VARCHAR(100) NOT NULL,
    annee_fond  INT NOT NULL CHECK (annee_fond > 1800),
    logo        VARCHAR(255) NOT NULL,          -- champ photo (nom du fichier)
    description TEXT
) ENGINE=InnoDB;

INSERT INTO marques (nom, pays, annee_fond, logo, description) VALUES
('Nike',        'États-Unis', 1964, 'nike.jpg',        'Leader mondial du sportswear.'),
('Adidas',      'Allemagne',  1949, 'adidas.jpg',      'Icône du sport et du lifestyle.'),
('Puma',        'Allemagne',  1948, 'puma.jpg',        'Style et performance depuis 1948.'),
('New Balance', 'États-Unis', 1906, 'newbalance.jpg',  'Confort et précision américaine.'),
('Converse',    'États-Unis', 1908, 'converse.jpg',    'Le classique intemporel Chuck Taylor.');

-- ============================================================
-- TABLE 2 : produits
-- Correspond à l'objet JavaScript : ProduitChaussure
-- ============================================================
CREATE TABLE IF NOT EXISTS produits (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    collection  ENUM('Men','Women','Kids') NOT NULL,
    marque_id   INT NOT NULL,
    modele      VARCHAR(150) NOT NULL,
    type        VARCHAR(100) NOT NULL,
    prix        DECIMAL(8,2) NOT NULL CHECK (prix > 0),
    photo       VARCHAR(255) NOT NULL,           -- champ photo
    disponible  TINYINT(1) NOT NULL DEFAULT 1,
    FOREIGN KEY (marque_id) REFERENCES marques(id) ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT INTO produits (collection, marque_id, modele, type, prix, photo) VALUES
('Men',   1, 'Air Max 90',      'Running',   149.99, 'nike.jpg'),
('Men',   1, 'Air Force 1',     'Casual',    109.99, 'nike.jpg'),
('Women', 2, 'Ultraboost 22',   'Running',   189.99, 'adidas.jpg'),
('Women', 3, 'Cali Dream',      'Lifestyle', 89.99,  'puma.jpg'),
('Kids',  4, 'New Balance 574', 'Lifestyle', 79.99,  'newbalance.jpg'),
('Men',   4, 'New Balance 990', 'Running',   174.99, 'newbalance.jpg'),
('Women', 5, 'Chuck Taylor Hi', 'Casual',    69.99,  'converse.jpg'),
('Kids',  1, 'Nike Revolution', 'Running',   59.99,  'nike.jpg');

-- ============================================================
-- TABLE 3 : avis  (questionnaire de satisfaction)
-- Correspond au formulaire questionnaire.html
-- ============================================================
CREATE TABLE IF NOT EXISTS avis (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    nom         VARCHAR(150) NOT NULL,
    email       VARCHAR(255) NOT NULL,
    note        TINYINT NOT NULL CHECK (note BETWEEN 1 AND 5),
    experience  ENUM('tres_satisfait','satisfait','insatisfait') NOT NULL,
    newsletter  TINYINT(1) NOT NULL DEFAULT 0,
    commentaire TEXT NOT NULL,
    date_avis   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO avis (nom, email, note, experience, newsletter, commentaire) VALUES
('Ahmed Ben Ali',    'ahmed@gmail.com',   5, 'tres_satisfait', 1, 'Excellent site, livraison rapide et produits de qualité !'),
('Sara Mrad',        'sara@outlook.com',  4, 'tres_satisfait', 0, 'Très bon choix de marques, interface agréable à utiliser.'),
('Mohamed Trabelsi', 'med@yahoo.fr',      3, 'satisfait',      1, 'Bien dans l''ensemble, mais manque de filtres avancés.'),
('Lina Bouaziz',     'lina@gmail.com',    5, 'tres_satisfait', 1, 'Je commande régulièrement ici, jamais déçue !'),
('Karim Jlassi',     'karim@hotmail.com', 2, 'insatisfait',    0, 'Délai de livraison trop long pour ma commande.');
