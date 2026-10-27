# Parcelles Locogen

Application web permettant aux agriculteurs et propriétaires de sélectionner leurs parcelles cadastrales sur une carte, puis de laisser leurs coordonnées pour être recontactés par Locogen au sujet d'un projet agrivoltaïque.

## Structure

```
index.html               ← Application (carte Leaflet + cadastre IGN + formulaire)
manifest.json            ← Métadonnées PWA (nom, couleurs, icônes)
sw.js                    ← Service Worker (cache + mode hors-ligne)
icon-192.png             ← Icône PWA
icon-512.png             ← Icône PWA (splash screen)
logo-locogen.png         ← Logo affiché dans l'en-tête
functions/api/submit.js  ← Fonction Cloudflare Pages : envoie la demande par email via Resend
```

## Visualiser la page

- **GitHub Pages** : https://wicky-arthur.github.io/parcelles-locogen/
  La carte, le cadastre et la recherche d'adresse fonctionnent. L'envoi du formulaire, lui, ne fonctionne pas : GitHub Pages n'héberge que des fichiers statiques et ne peut pas exécuter `functions/api/submit.js`.
- **Cloudflare Pages** (version complète, formulaire compris) :
  1. dash.cloudflare.com → Workers & Pages → Create → Pages → Connect to Git → `parcelles-locogen`
  2. Laisser la commande de build et le dossier de sortie vides
  3. Ajouter la variable secrète `RESEND_API_KEY` dans les réglages du projet

## Recevoir les demandes

Le formulaire envoie les données à `/api/submit`, qui les transmet par email à `arthur.wicky@locogen.com` via l'API Resend.
L'expéditeur `onboarding@resend.dev` reste à conserver tant qu'aucun nom de domaine n'est validé sur Resend.

## Données utilisées

- Fond de carte : OpenStreetMap / Esri (satellite)
- Cadastre : IGN (WMS Parcellaire Express + API Carto)
- Recherche d'adresse : api-adresse.data.gouv.fr
