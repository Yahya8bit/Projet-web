/**
 * Projet Web Phase 3
 * Membres : Yahia, Ghafer
 * 
 * Fichier : questionnaire.js
 * Description : Validation côté client du formulaire de satisfaction à l'aide de JavaScript.
 */

// On attend que la page HTML soit entièrement chargée
document.addEventListener("DOMContentLoaded", function () {
    // Récupération de l'élément formulaire par son ID
    var form = document.getElementById("questionnaireForm");
    
    // Si la page ne contient pas le formulaire (ex: on est sur une autre page), on s'arrête
    if (!form) {
        return;
    }

    // Ajout d'un écouteur d'événement sur la soumission du formulaire
    form.addEventListener("submit", function (e) {
        // On empêche le rechargement immédiat de la page
        e.preventDefault();
        
        // Tableau qui contiendra tous les messages d'erreur éventuels
        var errors = [];

        // ----------------------------------------
        // 1. Validation du champ Texte (Nom)
        // ----------------------------------------
        var nom = document.getElementById("qNom").value.trim();
        // Vérifier si le nom contient au moins 2 caractères
        if (nom.length < 2) {
            errors.push("Le nom doit contenir au moins 2 caractères.");
        }

        // ----------------------------------------
        // 2. Validation du champ Courriel (Email)
        // ----------------------------------------
        var email = document.getElementById("qEmail").value.trim();
        // Vérification très basique du format email
        if (email.indexOf("@") === -1 || email.indexOf(".") === -1) {
            errors.push("Veuillez entrer une adresse e-mail valide contenant '@' et un '.'.");
        }

        // ----------------------------------------
        // 3. Validation de la liste déroulante (Note globale)
        // ----------------------------------------
        var note = document.getElementById("qNote").value;
        // Vérifier si l'utilisateur a choisi une note valide
        if (!note || note === "") {
            errors.push("Veuillez choisir une note globale dans la liste déroulante.");
        }

        // ----------------------------------------
        // 4. Validation des boutons Radio (Expérience)
        // ----------------------------------------
        var radios = document.getElementsByName("qExperience");
        var radioChoisi = false;
        
        // Parcourir tous les boutons radio de ce nom pour vérifier si l'un d'eux est "checked"
        for (var i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
                radioChoisi = true;
                break;
            }
        }
        
        // Si aucun bouton radio n'a été sélectionné
        if (!radioChoisi) {
            errors.push("Veuillez choisir votre niveau de satisfaction (boutons radio).");
        }

        // ----------------------------------------
        // 5. Validation de la Zone de texte (Commentaire)
        // ----------------------------------------
        var commentaire = document.getElementById("qCommentaire").value.trim();
        // Vérifier la longueur minimale
        if (commentaire.length < 10) {
            errors.push("Le commentaire doit faire au moins 10 caractères.");
        }

        // ========================================
        // Traitement final
        // ========================================
        
        // S'il y a des erreurs, on les affiche et on annule la soumission
        if (errors.length > 0) {
            alert("Erreurs trouvées :\n\n- " + errors.join("\n- "));
            // Le return stop l'exécution de la fonction ici
            return;
        }

        // Si tout est correct, on valide et on informe l'utilisateur
        alert("Merci ! Votre avis a été enregistré avec succès (démo locale).");
        
        // Réinitialisation du formulaire à son état initial
        form.reset();
    });
});
