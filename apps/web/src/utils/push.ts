import { api } from "../lib/api";

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY as string | undefined;

function urlBase64ToUint8Array(base64: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(b64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}

export function isPushSupported(): boolean {
  return (
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

export function currentPermission(): NotificationPermission {
  if (typeof Notification === "undefined") return "denied";
  return Notification.permission;
}

/** Register the SW. Safe to call multiple times — browser deduplicates. */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!isPushSupported()) return null;
  try {
    const reg = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
    // Wait for the SW to be ready before returning
    await navigator.serviceWorker.ready;
    return reg;
  } catch (err) {
    console.error("[push] SW registration failed:", err);
    return null;
  }
}

/**
 * Set up the push subscription and save it to the server.
 * Assumes Notification.permission === "granted" — do NOT call this before requesting permission.
 */
export async function saveDonorSubscription(): Promise<void> {
  if (!VAPID_PUBLIC_KEY) {
    console.warn("[push] VITE_VAPID_PUBLIC_KEY is not set — check apps/web/.env");
    return;
  }

  const reg = await registerServiceWorker();
  if (!reg) return;

  let subscription = await reg.pushManager.getSubscription();

  if (!subscription) {
    subscription = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });
  }

  const { endpoint, keys } = subscription.toJSON() as {
    endpoint: string;
    keys: { auth: string; p256dh: string };
  };

  await api.post("/api/push/subscribe", { endpoint, keys });
}

/**
 * Get or create a PushManager subscription and save it as a request-scoped
 * subscription on the server. Call this after permission is already granted.
 * Works for both registered donors and anonymous requesters.
 */
export async function saveRequestSubscription(requestId: string): Promise<void> {
  if (!VAPID_PUBLIC_KEY) {
    console.warn("[push] VITE_VAPID_PUBLIC_KEY is not set — check apps/web/.env");
    return;
  }

  const reg = await registerServiceWorker();
  if (!reg) return;

  let subscription = await reg.pushManager.getSubscription();
  if (!subscription) {
    subscription = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });
  }

  const { endpoint, keys } = subscription.toJSON() as {
    endpoint: string;
    keys: { auth: string; p256dh: string };
  };

  await api.post("/api/push/subscribe-request", { endpoint, keys, requestId });
}

/**
 * Re-use an existing push subscription (donor already subscribed) and link it
 * to a specific request. No-ops if there's no subscription yet — use
 * saveRequestSubscription instead when permission may not be granted.
 */
export async function subscribeRequestPush(requestId: string): Promise<void> {
  if (!isPushSupported() || currentPermission() !== "granted" || !VAPID_PUBLIC_KEY) return;

  const reg = await navigator.serviceWorker.getRegistration("/sw.js");
  if (!reg) return;

  const subscription = await reg.pushManager.getSubscription();
  if (!subscription) return;

  const { endpoint, keys } = subscription.toJSON() as {
    endpoint: string;
    keys: { auth: string; p256dh: string };
  };

  try {
    await api.post("/api/push/subscribe-request", { endpoint, keys, requestId });
  } catch {
    // non-critical
  }
}

/** Unsubscribe the current device. */
export async function unsubscribePush(): Promise<void> {
  if (!isPushSupported()) return;

  const reg = await navigator.serviceWorker.getRegistration("/sw.js");
  if (!reg) return;

  const subscription = await reg.pushManager.getSubscription();
  if (!subscription) return;

  try {
    await api.delete("/api/push/unsubscribe", { endpoint: subscription.endpoint });
  } catch {
    // continue regardless
  }

  await subscription.unsubscribe();
}
