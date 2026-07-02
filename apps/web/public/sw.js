const CACHE_NAME = "lifeline-sw-v1";

// ── Lifecycle ────────────────────────────────────────────────────────────────

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
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
