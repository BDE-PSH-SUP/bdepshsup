const CACHE_NAME = "bde-psh-cache-v1";

const urlsToCache = [
  "./",
  "index.html",
  "style.css",
  "manifest-public.json",
  "icons/icon-192.png",
  "icons/icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

/* 🔔 PUSH */
self.addEventListener("push", event => {
  let data = {};
  if (event.data) data = event.data.json();

  const title = data.title || "BDE PSH";
  const options = {
    body: data.body || "Nouvelle notification",
    icon: "icons/icon-192.png",
    badge: "icons/icon-192.png",
    data: {
      url: data.url || "index.html"
    }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
