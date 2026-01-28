self.addEventListener("install", event => {
  console.log("SW ADMIN installé");
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  console.log("SW ADMIN activé");
  self.clients.claim();
});

/* Pas de cache, pas de push, pas d’offline */
self.addEventListener("fetch", event => {
  event.respondWith(fetch(event.request));
});
