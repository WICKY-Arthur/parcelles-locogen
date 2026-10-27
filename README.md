# Locogen — Guide de déploiement

## Structure du dossier

```
locogen/
├── locogen.html      ← Application principale (tout-en-un)
├── manifest.json     ← Métadonnées PWA (nom, couleurs, icônes)
├── sw.js             ← Service Worker (cache + mode hors-ligne)
├── icon-192.png      ← Icône PWA (écran d'accueil Android)
└── icon-512.png      ← Icône PWA (splash screen, stores)
```

> Ces 5 fichiers doivent rester **dans le même dossier**.
> Ne les séparez pas.

---

## Option 1 — Intégration dans un site web existant

Copiez les 5 fichiers dans un sous-dossier de votre site, par exemple :

```
votre-site.fr/locogen/locogen.html
```

L'outil est immédiatement accessible à cette URL.

Pour l'intégrer dans une page existante (ex. une landing page),
ajoutez un bouton qui ouvre l'outil dans un nouvel onglet :

```html
<a href="/locogen/locogen.html" target="_blank">
  Déposer mon projet →
</a>
```

Ou en iframe (déconseillé sur mobile, préférer le lien) :

```html
<iframe src="/locogen/locogen.html"
        style="width:100%;height:700px;border:none;border-radius:12px;">
</iframe>
```

---

## Option 2 — Hébergement statique gratuit (Netlify, recommandé)

1. Allez sur https://app.netlify.com/drop
2. Glissez-déposez le dossier `locogen/` sur la page
3. Netlify vous donne une URL publique en 30 secondes
   ex. `https://locogen-abc123.netlify.app/locogen.html`
4. Partagez cette URL à vos collègues

Avantage : HTTPS activé automatiquement → obligatoire pour la PWA.

---

## Option 3 — Application téléphone (PWA, sans App Store)

La PWA fonctionne dès que le site est servi en **HTTPS**.

### Sur iPhone (Safari) :
1. Ouvrez l'URL dans Safari
2. Touchez le bouton Partager (⬛ flèche vers le haut)
3. "Sur l'écran d'accueil"
4. L'app apparaît avec l'icône soleil ☀️

### Sur Android (Chrome) :
1. Ouvrez l'URL dans Chrome
2. Chrome propose automatiquement "Installer l'application"
3. Ou : menu ⋮ → "Ajouter à l'écran d'accueil"

---

## Recevoir les demandes

Par défaut, les soumissions s'affichent uniquement en console.
Pour les recevoir par email ou dans un CRM :

1. Créez un Zap sur https://zapier.com (gratuit jusqu'à 100 leads/mois)
2. Déclencheur : "Webhooks by Zapier — Catch Hook"
3. Copiez l'URL fournie par Zapier
4. Dans `locogen.html`, cherchez la ligne :
   ```
   // fetch('https://hooks.zapier.com/hooks/catch/XXXXX/YYYYY'
   ```
5. Décommentez-la et remplacez l'URL par la vôtre

---

## Bugs corrigés (vs version précédente)

| Problème | Cause | Correction |
|---|---|---|
| Parcelles cadastrales invisibles | Layer WMS dans le même pane que le fond de carte (z-index identique) | Pane dédié `cadastrePane` z-index 350, entre tuiles (200) et polygones (400) |
| Fond de carte recouvre le cadastre après switch Plan/Sat | Remove+addTo du WMS perturbait l'ordre de rendu | Plus besoin : le pane est indépendant du fond |
| Requêtes apicarto sans timeout | Requête pouvait rester bloquée indéfiniment | Timeout 8 secondes avec AbortController |
| Polygone sélectionné sous le cadastre | — | GeoJSON dans overlayPane (z=400), au-dessus du cadastrePane (z=350) |
