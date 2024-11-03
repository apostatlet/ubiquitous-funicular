// Cache name and files to cache
const cacheName = 'unit-converter-cache-v11';
const filesToCache = [
  '/',
  '/index.html',
  '/app.js',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/sw.js'
];

console.log('Service Worker: registered and caching');

// Install event - caching the app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      console.log('Service Worker: caching all files');
      return cache.addAll(filesToCache);
    })
  );
});

// Activate event - delete old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: activating and deleting old caches');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cache) => cache !== cacheName)
          .map((cache) => caches.delete(cache))
      );
    })
  );
});

// Fetch event - network first for navigation, cache first for others
self.addEventListener('fetch', (event) => {
  console.log('Service Worker: fetching resource', event.request.url);

  if (event.request.mode === 'navigate') {
    // Network-first strategy for navigation requests
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          // Successful network response, update the cache
          return caches.open(cacheName).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            console.log('Service Worker: updated cache with network response for', event.request.url);
            return networkResponse;
          });
        })
        .catch(() => {
          // Network failed, fallback to cache
          console.log('Service Worker: network failed, serving from cache', event.request.url);
          return caches.match('/index.html');
        })
    );
  } else {
    // Cache-first strategy for other requests
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});
