// Cache name and files to cache
const cacheName = 'unit-converter-cache-v3'; // Change version to force update
const filesToCache = [
  '/',
  '/index.html',
  '/app.js',
  '/manifest.json'
];

// Install event - caching the app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(filesToCache);
    })
  );
});

// Fetch event - serving cached content when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
