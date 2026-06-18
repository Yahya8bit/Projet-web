/**
 * Projet Web Phase 3
 * Membres : Yahia, Ghafer
 * 
 * Fichier : funpage.js
 * Description : Implémentation du mini-jeu interactif et démonstration de la propagation des événements (bubbling et stopPropagation).
 */

// Variable globale pour stocker la référence au conteneur de logs
var logBubbleEl;

/**
 * Ajoute une ligne de texte dans le conteneur de logs de propagation.
 * @param {string} message - Le message à afficher
 */
function ecrireLogPropagation(message) {
    if (!logBubbleEl) {
        return;
    }
    // Création dynamique d'un div pour stocker la ligne de log
    var ligne = document.createElement("div");
    ligne.textContent = message;
    // Ajout dans le conteneur parent (DOM)
    logBubbleEl.appendChild(ligne);
}

/**
 * Vide le conteneur de logs.
 */
function viderLogPropagation() {
    if (!logBubbleEl) {
        return;
    }
    // Nettoyer le contenu HTML interne
    logBubbleEl.innerHTML = "";
}

// L'événement DOMContentLoaded s'assure que tout le HTML est chargé avant d'exécuter le script
document.addEventListener("DOMContentLoaded", function () {
    // ==========================================
    // 1. Jeu interactif : Deviner le mot
    // ==========================================
    var inputMot = document.getElementById("jeuMot");
    var btnVerifier = document.getElementById("jeuVerifier");
    var feedbackJeu = document.getElementById("jeuFeedback");

    // Paramètres du jeu
    var motSecret = "Basket";
    var essaisRestants = 5;

    if (btnVerifier && inputMot && feedbackJeu) {
        // Clic sur le bouton de vérification
        btnVerifier.addEventListener("click", function () {
            var saisie = inputMot.value.trim();
            
            if (!saisie) {
                feedbackJeu.textContent = "Entrez un mot.";
                return;
            }
            
            // Comparaison sans tenir compte de la casse
            if (saisie.toLowerCase() === motSecret.toLowerCase()) {
                // Succès
                feedbackJeu.textContent = "Bravo ! Le mot était bien « " + motSecret + " ».";
                feedbackJeu.style.color = "#4caf50"; // Vert
            } else {
                // Échec et diminution du nombre d'essais
                essaisRestants -= 1;
                feedbackJeu.textContent = "Ce n'est pas ça. Il reste " + essaisRestants + " essai(s).";
                feedbackJeu.style.color = "#ff9800"; // Orange
                
                // Si plus d'essais, fin de partie
                if (essaisRestants <= 0) {
                    feedbackJeu.textContent = "Partie terminée. Le mot était : " + motSecret + ".";
                    feedbackJeu.style.color = "#f44336"; // Rouge
                    btnVerifier.disabled = true; // Empêcher d'autres tentatives
                }
            }
        });
    }

    // ==========================================
    // 2. Propagation des événements (Event Bubbling)
    // ==========================================
    logBubbleEl = document.getElementById("bubbleLog");

    // Références vers les trois éléments HTML imbriqués
    var zoneOuter = document.getElementById("bubbleOuter");
    var zoneMiddle = document.getElementById("bubbleMiddle");
    var btnInnerBubble = document.getElementById("bubbleInnerBubble");
    var btnInnerStop = document.getElementById("bubbleInnerStop");

    // Ajout des écouteurs de clic sur l'élément périphérique
    if (zoneOuter) {
        zoneOuter.addEventListener("click", function () {
            ecrireLogPropagation("→ Événement reçu par : #bubbleOuter (div extérieur)");
        });
    }

    // Écouteur sur l'élément intermédiaire
    if (zoneMiddle) {
        zoneMiddle.addEventListener("click", function () {
            ecrireLogPropagation("→ Événement reçu par : #bubbleMiddle (div milieu)");
        });
    }

    // Écouteur sur le bouton permettant la propagation normale
    if (btnInnerBubble) {
        btnInnerBubble.addEventListener("click", function () {
            ecrireLogPropagation("→ Événement reçu par : #bubbleInnerBubble (bouton — propagation active)");
            // Par défaut, l'événement monte (bubble down) vers bubbleMiddle puis bubbleOuter
        });
    }

    // Écouteur sur le bouton arrêtant la propagation
    if (btnInnerStop) {
        btnInnerStop.addEventListener("click", function (evt) {
            ecrireLogPropagation("→ Événement reçu par : #bubbleInnerStop uniquement (stopPropagation)");
            // La méthode stopPropagation empêche l'événement de se déclencher sur les parents
            evt.stopPropagation();
        });
    }

    // Bouton de réinitialisation des logs
    var btnClearLog = document.getElementById("bubbleClearLog");
    if (btnClearLog) {
        btnClearLog.addEventListener("click", function () {
            viderLogPropagation();
        });
    }

    // ==========================================
    // 3. Gestion des événements clavier
    // ==========================================
    // Écoute des touches au niveau de l'ensemble du document
    document.addEventListener("keydown", function (ev) {
        var hint = document.getElementById("keyboardHint");
        if (!hint) {
            return;
        }
        // Identifier spécifiquement les touches directionnelles haut/bas
        if (ev.key === "ArrowUp" || ev.key === "ArrowDown") {
            hint.textContent = "Touche clavier détectée : " + ev.key;
        }
    });
});
