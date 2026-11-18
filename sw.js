/**
 * Service Worker: Contâiner Parada Obrigatória
 * Caching inteligente para funcionamento offline com sinal instável na beira da praia.
 */

const CACHE_NAME = 'container-parada-v1';
const STATIC_ASSETS = [
  './index.html',
  './src/styles/tokens.css',
  './src/styles/main.css',
  './src/js/menu.js',
  './src/data/menu.json',
  './manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // Ignorar requisições não-GET e links externos de analytics/whatsapp
  if (e.request.method !== 'GET' || !e.request.url.startsWith(self.location.origin)) {
    return;
  }

  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Retornar cache imediatamente e atualizar em background (Stale-While-Revalidate)
        fetch(e.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(e.request, networkResponse.clone());
            });
          }
        }).catch(() => {});
        return cachedResponse;
      }
      return fetch(e.request);
    })
  );
});
