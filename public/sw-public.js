self.addEventListener("install", event => {
  console.log("SW installé");
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  console.log("SW activé");
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  event.respondWith(fetch(event.request));
});

/* 🔔 PUSH */
self.addEventListener("push", event => {
  let data = {};
  if (event.data) {
    data = event.data.json();
  }

  const title = data.title || "BDE PSH";
  const options = {
    body: data.body || "Nouvelle notification",
    icon: "icons/icon-192.png",
    badge: "icons/icon-192.png",
    data: {
      url: data.url || "index.html"
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener("notificationclick", event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
