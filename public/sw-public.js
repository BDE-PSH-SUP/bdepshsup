/* ===========================
   📦 CACHE PWA
=========================== */
const CACHE_NAME = "bde-psh-cache-v1";
const urlsToCache = [
  "/BDE-PSH-SUP/",
  "/BDE-PSH-SUP/index.html",
  "/BDE-PSH-SUP/style.css",
  "/BDE-PSH-SUP/public/manifest-public.json",
  "/BDE-PSH-SUP/icons/icon-192.png",
  "/BDE-PSH-SUP/icons/icon-512.png"
];

/* ===========================
   📥 INSTALL
=========================== */
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

/* ===========================
   🔁 ACTIVATE
=========================== */
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keyList =>
      Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

/* ===========================
   🌐 FETCH
=========================== */
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

/* ===========================
   🔔 PUSH NOTIFICATION
=========================== */
self.addEventListener("push", event => {
  let data = {};

  if (event.data) {
    data = event.data.json();
  }

  const title = data.title || "BDE PSH";
  const options = {
    body: data.body || "Nouvelle notification",
    icon: "/BDE-PSH-SUP/icons/icon-192.png",
    badge: "/BDE-PSH-SUP/icons/icon-192.png",
    data: {
      url: data.url || "/BDE-PSH-SUP/"
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

/* ===========================
   👉 CLICK NOTIFICATION
=========================== */
self.addEventListener("notificationclick", event => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url === event.notification.data.url && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data
