// Cache name and files to cache
const cacheName = 'unit-converter-cache-v12';
const filesToCache = [
  '/',
  '/index.html',
  '/app.js',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/sw.js'
];

// Helper function to log messages to the app
function logToApp(message) {
  self.clients.matchAll().then(clients => {
    clients.forEach(client => client.postMessage(message));
  });
}

logToApp('Service Worker: registered and caching');

// Install event - caching the app shell
self.addEventListener('install', (event) => {
  logToApp('Service Worker: Install event - caching files');
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      logToApp('Service Worker: Caching all specified files');
      return cache.addAll(filesToCache);
    })
  );
});

// Activate event - delete old caches
self.addEventListener('activate', (event) => {
  logToApp('Service Worker: Activate event - deleting old caches');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cache) => cache !== cacheName)
          .map((cache) => {
            logToApp(`Service Worker: Deleting cache ${cache}`);
            return caches.delete(cache);
          })
      );
    })
  );
});

// Fetch event - network-first for navigation, cache-first for others
self.addEventListener('fetch', (event) => {
  logToApp(`Service Worker: Fetching resource ${event.request.url}`);

  if (event.request.mode === 'navigate') {
    // Network-first strategy for navigation requests
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          // Successful network response, update the cache
          logToApp(`Service Worker: Network success for ${event.request.url}`);
          return caches.open(cacheName).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            logToApp(`Service Worker: Updated cache with network response for ${event.request.url}`);
            return networkResponse;
          });
        })
        .catch(() => {
          // Network failed, fallback to cache
          logToApp(`Service Worker: Network failed, serving from cache ${event.request.url}`);
          return caches.match('/index.html');
        })
    );
  } else {
    // Cache-first strategy for other requests
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          logToApp(`Service Worker: Cache hit for ${event.request.url}`);
        } else {
          logToApp(`Service Worker: Cache miss, fetching from network ${event.request.url}`);
        }
        return response || fetch(event.request);
      })
    );
  }
});
