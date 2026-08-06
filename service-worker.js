const CACHE_NAME = 'finanzas-v2';
const urlsToCache = [
  './index.html',
  './manifest.json',
  './icon.png'
];

// Instalar el Service Worker y guardar los archivos en caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Responder a las solicitudes (cargar desde caché si no hay internet)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
