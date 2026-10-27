// sw.js — Service Worker Locogen V2
// Stratégie : Réseau d'abord (Network First) pour toujours avoir les dernières mises à jour,
// cache en secours si on perd la connexion.

const CACHE_NAME = 'locogen-v3'; // Changer la version force le nettoyage de l'ancien cache !

// Les fichiers de base à mettre en cache
const STATIC_ASSETS =[
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './logo-locogen.png',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

// ── INSTALLATION ──
self.addEventListener('install', event => {
  self.skipWaiting(); // Force le nouveau SW à prendre le contrôle immédiatement
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS).catch(err => console.warn('Cache error:', err));
    })
  );
});

// ── ACTIVATION : Nettoyage de la V1 buggée ──
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      );
    })
  );
  self.clients.claim();
});

// ── FETCH : Stratégie Network First ──
self.addEventListener('fetch', event => {
  // On ne touche pas aux requêtes POST (comme l'envoi du formulaire)
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Si internet marche, on renvoie la page et on met à jour le cache silencieusement
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, clone);
        });
        return response;
      })
      .catch(() => {
        // Si pas d'internet (ou erreur réseau), on cherche dans le cache
        return caches.match(event.request).then(cached => {
          return cached || caches.match('./'); // Fallback sur la racine
        });
      })
  );
});