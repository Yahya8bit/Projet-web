/**
 * Projet Web Phase 3
 * Membres : Yahia, Ghafer
 * 
 * Fichier : products.js
 * Description : Gestion de l'ajout dynamique et de la recherche dans un tableau (objets, arrays et DOM).
 */

/**
 * Fonction constructeur permettant de créer un objet produit (type d'objet).
 * @param {string} collection - La collection (Men, Women, Kids)
 * @param {string} marque - La marque de la chaussure
 * @param {string} modele - Le modèle ou nom
 * @param {string} type - Le type (Casual, Running, Lifestyle)
 */
function ProduitChaussure(collection, marque, modele, type) {
    this.collection = collection; // Ex: 'Men'
    this.marque = marque;         // Ex: 'Nike'
    this.modele = modele;         // Ex: 'Air Max'
    this.type = type;             // Ex: 'Running'
}

/**
 * Initialisation de la collection : tableau contenant des instances (objets) de ProduitChaussure.
 */
var catalogueProduits = [
    new ProduitChaussure("Men", "Nike", "Air Max", "Running"),
    new ProduitChaussure("Men", "Nike", "Air Force", "Casual"),
    new ProduitChaussure("Women", "Adidas", "Ultraboost", "Running"),
    new ProduitChaussure("Women", "Puma", "Cali", "Lifestyle"),
    new ProduitChaussure("Kids", "Converse", "Chuck Taylor", "Casual"),
    new ProduitChaussure("Men", "New Balance", "574", "Lifestyle")
];

/**
 * Fonction #1 : Afficher les données correspondantes dans le tableau HTML dynamiquement.
 * @param {Array} liste - Le tableau d'objets à itérer et afficher
 */
function afficherDonneesTableau(liste) {
    var tbody = document.getElementById("productsBody");
    if (!tbody) {
        return; // Ne rien faire si on n'est pas sur la bonne page
    }
    
    // Vider le tableau HTML avant de le re-remplir
    tbody.innerHTML = "";
    
    // Parcourir tous les éléments de la liste (array) fournie
    for (var i = 0; i < liste.length; i++) {
        var p = liste[i];
        
        // Création dynamique d'une nouvelle ligne <tr>
        var tr = document.createElement("tr");
        
        // Colonne 1 : Collection
        var td1 = document.createElement("td");
        td1.textContent = p.collection;
        
        // Colonne 2 : Marque
        var td2 = document.createElement("td");
        td2.textContent = p.marque;
        
        // Colonne 3 : Modèle
        var td3 = document.createElement("td");
        td3.textContent = p.modele;
        
        // Colonne 4 : Type
        var td4 = document.createElement("td");
        td4.textContent = p.type;
        
        // Imbrication des cellules dans la ligne
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        
        // Ajout final de la ligne construite au corps de la table HTML
        tbody.appendChild(tr);
    }
}

/**
 * Fonction #2 : Ajouter dynamiquement une ligne/un objet produit au tableau.
 * @param {object} produit - L'objet de type ProduitChaussure à ajouter
 */
function ajouterLigneProduit(produit) {
    // On l'ajoute directement dans notre collection (Array de base)
    catalogueProduits.push(produit);
    // On met à jour l'affichage en rappelant la fonction d'affichage global
    afficherDonneesTableau(catalogueProduits);
}

// Initialisation dès que la page HTML est prête (DOM Content Loaded)
document.addEventListener("DOMContentLoaded", function () {
    
    // Affichage des données lors du premier chargement
    afficherDonneesTableau(catalogueProduits);

    // ===========================================
    // Gestion du formulaire d'ajout
    // ===========================================
    var formAdd = document.getElementById("formAddProduct");
    if (formAdd) {
        formAdd.addEventListener("submit", function (e) {
            e.preventDefault(); // On bloque l'envoi "réel" vers un serveur
            
            // Récupération des valeurs insérées par l'utilisateur
            var col = document.getElementById("addCollection").value;
            var marque = document.getElementById("addBrand").value.trim();
            var modele = document.getElementById("addModel").value.trim();
            var type = document.getElementById("addType").value.trim();
            
            // Vérification de base (Validation JS)
            if (!marque || !modele || !type) {
                alert("Erreur - Veuillez remplir marque, modèle et type.");
                return;
            }
            
            // Instanciation de l'objet à l'aide du constructeur
            var nouveau = new ProduitChaussure(col, marque, modele, type);
            
            // On ajoute et on actualise
            ajouterLigneProduit(nouveau);
            
            // On réinitialise les champs de formulaire
            formAdd.reset();
        });
    }

    // ===========================================
    // Gestion du formulaire de recherche
    // ===========================================
    var formSearch = document.getElementById("formSearchProduct");
    if (formSearch) {
        formSearch.addEventListener("submit", function (e) {
            e.preventDefault();
            
            // Mot cléf converti en minuscules pour faciliter la comparaison insensible à la casse
            var query = document.getElementById("searchQuery").value.trim().toLowerCase();
            
            // Si le champ est vide, on affiche tout
            if (query === "") {
                afficherDonneesTableau(catalogueProduits);
                return;
            }
            
            var resultats = [];
            // Boucle de recherche sur l'ensemble du catalogue
            for (var j = 0; j < catalogueProduits.length; j++) {
                var item = catalogueProduits[j];
                
                // Concaténation de toutes les propriétés pour vérifier la présence du mot
                var texte = item.collection.toLowerCase() + " " + item.marque.toLowerCase() + " " + item.modele.toLowerCase() + " " + item.type.toLowerCase();
                
                // IndexOf retourne une numération >= 0 s'il trouve une occurrence
                if (texte.indexOf(query) !== -1) {
                    resultats.push(item);
                }
            }
            
            // On manipule l'affichage dynamique avec UNIQUEMENT nos résultats
            afficherDonneesTableau(resultats);
        });
    }

    // ===========================================
    // Bouton de réinitialisation de l'affichage
    // ===========================================
    var btnResetSearch = document.getElementById("btnResetSearch");
    if (btnResetSearch) {
        btnResetSearch.addEventListener("click", function () {
            // Remise à zéro du champ puis rafraîchissement
            document.getElementById("searchQuery").value = "";
            afficherDonneesTableau(catalogueProduits);
        });
    }
});
