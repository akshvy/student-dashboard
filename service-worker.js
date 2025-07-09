const CACHE_NAME = "student-dashboard-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/budget.html",
  "/notes.html",
  "/attendance.html",
  "/budget.js",
  "/notes.js",
  "/attendance.js",
  "/style.css",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png"
];

// Install: cache files
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Fetch: serve cached if offline
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

// Activate: cleanup old caches
self.addEventListener("activate", event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(name => {
          if (!cacheWhitelist.includes(name)) {
            return caches.delete(name);
          }
        })
      )
    )
  );
});
