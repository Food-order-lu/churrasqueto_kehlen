# Churrasqueto Kehlen

Site vitrine pour le restaurant brésilien Churrasqueto à Kehlen, Luxembourg.

## Fonctionnalités

- 🏠 Site vitrine complet
- 📋 Menu de la semaine
- 🎉 Section événements
- 🖼️ Galerie photos
- 📍 Contact avec Google Maps
- 🔐 Panneau admin (/admin.html)

## Démarrage local

```bash
# Serveur Python simple
python3 -m http.server 3000

# Ou avec Node.js
npx serve -p 3000
```

Ouvrir http://localhost:3000

## Admin

- URL: `/admin.html`
- Mot de passe: `admin123`

## Stack

- HTML5 / CSS3 / JavaScript vanilla
- Firebase (à configurer)
- Cloudinary (pour les images)

## Structure

```
├── index.html          # Page principale
├── admin.html          # Panneau admin
├── css/
│   ├── styles.css      # Styles du site
│   └── admin.css       # Styles admin
├── js/
│   ├── main.js         # Scripts du site
│   └── admin.js        # Scripts admin
└── assets/
    └── images/         # Images
```

## Licence

© 2024 Churrasqueto Kehlen. Tous droits réservés.
