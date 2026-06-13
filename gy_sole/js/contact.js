/**
 * Projet Web Phase 3
 * Membres : Yahia, Ghafer
 * 
 * Fichier : contact.js
 * Description : Gestion de la bannière animée (date et heure) et de la galerie d'images.
 */

document.addEventListener("DOMContentLoaded", function () {
    // On récupère le span qui contiendra le texte de la bannière
    var marqueeText = document.getElementById("contactMarqueeText");
    var companyName = "G&Y Sole";

    /**
     * Cette fonction génère la date et l'heure actuelles
     * et met à jour le contenu de la bannière.
     */
    function mettreAJourBanniere() {
        if (!marqueeText) {
            // Si l'élément n'existe pas, on a peut-être encore l'ancienne balise ou on est sur une autre page
            var altMarquee = document.getElementById("contactMarquee");
            if(!altMarquee) return;
        }

        var now = new Date();
        // Création de la chaîne de date en français (ex: "jeudi 26 mars 2026")
        var dateStr = now.toLocaleDateString("fr-FR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        });
        
        // Création de la chaîne d'heure
        var timeStr = now.toLocaleTimeString("fr-FR");
        
        // Construction du message final
        var msg = "Bienvenue au site web " + companyName + " ! Aujourd'hui " + dateStr + ", et l'heure actuelle est " + timeStr + ".";
        
        if (marqueeText) {
            marqueeText.textContent = msg;
        } else {
            // Fallback
            document.getElementById("contactMarquee").textContent = msg;
        }
    }

    // Affichage immédiat puis rafraîchissement toutes les 1000 millisecondes (1 seconde)
    mettreAJourBanniere();
    setInterval(mettreAJourBanniere, 1000);

    // =====================================
    // Gestion de la galerie d'images rotative
    // =====================================
    var imgEl = document.getElementById("contactGalleryImg");
    
    // Tableau (Collection) contenant les chemins des images
    // Les chemins sont relatifs au fichier HTML qui est dans pages/
    var sources = [
        "../img/nike.jpg", 
        "../img/adidas.jpg", 
        "../img/puma.jpg", 
        "../img/newbalance.jpg", 
        "../img/converse.jpg"
    ];
    var index = 0;
    
    // Démarrer la rotation seulement si on a l'élément et des images
    if (imgEl && sources.length > 0) {
        // Définir la première image par défaut
        imgEl.src = sources[0];
        imgEl.alt = "Galerie G&Y Sole";
        
        // Répéter l'action toutes les 3 secondes
        setInterval(function () {
            // Incrémentation circulaire de l'index
            index = (index + 1) % sources.length;
            // Mise à jour de la source de l'image
            imgEl.src = sources[index];
        }, 3000); // 3000 millisecondes = 3 secondes
    }
});
