const CACHE_NAME = "lifeline-sw-v1";

// ── Lifecycle ────────────────────────────────────────────────────────────────

// App shell — the minimum set of files needed to display the UI offline.
// Vite hashes JS/CSS at build time so we only precache stable public assets.
const SHELL = [
  "/",
  "/manifest.json",
  "/favicon.svg",
  "/icons/pwa-192.svg",
  "/icons/pwa-512.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)),
        ),
      ),
    ]),
  );
});

// ── Fetch (offline support) ───────────────────────────────────────────────────

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Never intercept API calls, socket handshakes, or cross-origin requests
  if (url.origin !== self.location.origin || url.pathname.startsWith("/api/")) {
    return;
  }

  // Static assets (JS, CSS, images, fonts) — cache first, fall back to network
  if (
    request.destination === "script" ||
    request.destination === "style" ||
    request.destination === "image" ||
    request.destination === "font"
  ) {
    event.respondWith(
      caches.match(request).then(
        (cached) => cached ?? fetch(request).then((res) => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(request, clone));
          return res;
        }),
      ),
    );
    return;
  }

  // Navigation requests — network first, fall back to cached shell
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match("/").then((cached) => cached ?? Response.error()),
      ),
    );
    return;
  }
});

// ── Push ─────────────────────────────────────────────────────────────────────

self.addEventListener("push", (event) => {
  if (!event.data) return;

  let payload;
  try {
    payload = event.data.json();
  } catch {
    payload = {
      title: "LifeLine",
      body: event.data.text(),
      icon: "/icons/notification-icon-192.svg",
      badge: "/icons/badge-72.svg",
      tag: "lifeline-generic",
      requireInteraction: false,
      data: { url: "/dashboard" },
    };
  }

  const {
    title,
    body,
    icon = "/icons/notification-icon-192.svg",
    badge = "/icons/badge-72.svg",
    tag = "lifeline-notification",
    requireInteraction = false,
    data = { url: "/dashboard" },
    actions = [],
  } = payload;

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon,
      badge,
      tag,
      requireInteraction,
      data,
      actions,
      vibrate: [200, 100, 200, 100, 200],
      timestamp: Date.now(),
      silent: false,
      renotify: true,
    }),
  );
});

// ── Notification click ───────────────────────────────────────────────────────

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  // Read the target path set by the server (e.g. "/dashboard" or "/request/:id")
  const targetPath = event.notification.data?.url ?? "/dashboard";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window" })
      .then((clientList) => {
        // Find an already-open tab on the same origin
        const existing = clientList.find(
          (c) => new URL(c.url).origin === self.location.origin,
        );

        if (existing) {
          // Navigate the existing tab and bring it to the front
          return existing.navigate(targetPath).then((c) => c && c.focus());
        }

        // No open tab — open a fresh one
        return self.clients.openWindow(targetPath);
      }),
  );
});

// ── Notification dismiss ──────────────────────────────────────────────────────

self.addEventListener("notificationclose", () => {
  // Reserved for analytics
});
