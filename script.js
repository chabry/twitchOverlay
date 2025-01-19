// Configuration du client tmi.js
const client = new tmi.Client({
    options: { debug: true },
    connection: {
        secure: true,
        reconnect: true
    },
    channels: ['sonkek'] // Remplace par le nom exact de ta chaîne Twitch
});

// Connexion au chat Twitch
client.connect().then(() => {
    console.log('Connecté au chat Twitch');
}).catch(err => {
    console.error('Erreur de connexion :', err);
});

function getBadgeUrls(badges) {
    const badgeUrls = [];
    if (badges) {
        for (const badgeType in badges) {
            switch (badgeType) {
                case "moderator":
                    badgeUrls.push('./moderatorBadge.png'); // Badge modérateur local
                    break;
                case "zevent-2024":
                    badgeUrls.push('./zevent2024.png'); // Badge ZEvent 2024 local
                    break;
                default:
                    console.warn(`Badge inconnu détecté : ${badgeType}`);
                    break;
            }
        }
    }
    return badgeUrls; // Tableau d'URLs
}

// Fonction pour ajouter un message au chat
function addMessage(username, color, badgeUrls, message) {
    const chatBox = document.getElementById('chat-box');

    // Boîte principale du message
    const messageBox = document.createElement('div');
    messageBox.className = 'message-box';

    // Header avec badges et pseudo
    const header = document.createElement('div');
    header.className = 'header';

    // Conteneur des badges
    const badgeContainer = document.createElement('div');
    badgeContainer.className = 'badge-container';

    // Ajouter les badges
    badgeUrls.forEach((badgeUrl, index) => {
        const badgeImg = document.createElement('img');
        badgeImg.src = badgeUrl;
        badgeImg.alt = 'Badge';
        badgeImg.style.width = '20px';
        badgeImg.style.height = '20px';
        badgeImg.style.objectFit = 'contain';

        // Ajouter un espacement sauf pour le dernier badge
        if (index < badgeUrls.length - 1) {
            badgeImg.style.marginRight = '5px';
        }

        badgeContainer.appendChild(badgeImg);
    });

    // Ajouter le pseudo
    const usernameElement = document.createElement('span');
    usernameElement.className = 'username';
    usernameElement.style.color = color || '#FFFFFF'; // Couleur par défaut blanche
    usernameElement.textContent = username;

    // Ajouter le contenu du message
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.textContent = message;

    // Assembler les éléments
    header.appendChild(badgeContainer);
    header.appendChild(usernameElement);
    messageBox.appendChild(header);
    messageBox.appendChild(messageContent);
    chatBox.appendChild(messageBox);

    // Scroll automatique vers le bas
    chatBox.scrollTop = chatBox.scrollHeight;

    // Supprimer le message après 20 secondes avec une animation
    setTimeout(() => {
        messageBox.classList.add('fade-out'); // Ajoute une classe pour l'animation
        setTimeout(() => {
            messageBox.remove(); // Supprime l'élément après l'animation
        }, 300); // Délai supplémentaire pour laisser l'animation se terminer
    }, 20000); // Supprimer après 20 secondes
}

// Gérer les messages Twitch
client.on('message', (channel, tags, message, self) => {
    console.log('Badges:', tags.badges); // Debug: Affiche les badges
    if (self) return; // Ignore tes propres messages

    // Déterminer l'URL du badge
    const badgeUrls = getBadgeUrls(tags.badges); // Récupère le badge local

    // Ajouter le message au chat
    addMessage(
        tags['display-name'], // Nom d'utilisateur
        tags.color, // Couleur du pseudo
        badgeUrls, // URL du badge
        message // Contenu du message
    );
});
