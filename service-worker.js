const CACHE_NAME = 'finanzas-v2'; // Subimos la versión
const urlsToCache = [
  './index.html',
  './manifest.json',
  './icon.png'
];

// Instalar el Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
  // Obliga al celular a usar esta nueva versión de inmediato
  self.skipWaiting(); 
});

// Activar y borrar la basura (versiones viejas)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Borrando caché antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Estrategia: Red primero, Caché de respaldo
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Si hay internet y la respuesta es válida, actualiza el caché con la nueva versión
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Si no hay internet (o falla la red), busca en el caché
        return caches.match(event.request);
      })
  );
});