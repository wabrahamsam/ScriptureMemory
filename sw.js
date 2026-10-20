// MemoryVerse service worker
// Keeps ONLY the current week's page (plus icons, manifest and fonts) available offline.
// Archive pages and the weeks list are deliberately not cached.

// Same number as APP_VERSION in weeks/current.html. Changing it starts a fresh offline cache.
const APP_VERSION = '1.1.0';
const CACHE_NAME = 'memoryverse-v' + APP_VERSION;
const CORE = ['./weeks/current.html'];
const EXTRAS = [
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png'
];
const SHELL_PATHS = CORE.concat(EXTRAS).map((p) => new URL(p, self.location).pathname);

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await cache.addAll(CORE); // required: if this fails, install retries on the next visit
      await Promise.all(EXTRAS.map((p) => cache.add(p).catch(() => {}))); // best effort
    })
  );
  self.skipWaiting();
});

// Only clean up OUR old caches. Other apps on this same github.io address keep their own caches.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('memoryverse-') && k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // The in-app "Check for new passage" button asks for the network directly.
  if (url.searchParams.has('mv-refresh')) return;

  // Font files never change at a given URL: serve from cache, fetch once if missing.
  if (url.origin === 'https://fonts.gstatic.com') {
    event.respondWith(cacheFirst(req));
    return;
  }
  // The font stylesheet can change: prefer the network, fall back to the saved copy offline.
  if (url.origin === 'https://fonts.googleapis.com') {
    event.respondWith(networkFirst(req));
    return;
  }

  // The app's own files: show the saved copy instantly, refresh it quietly in the background.
  if (url.origin === self.location.origin && SHELL_PATHS.includes(url.pathname)) {
    event.respondWith(staleWhileRevalidate(event, url));
    return;
  }
  // Anything else (index, archive pages, weeks list) goes straight to the network.
});

async function cacheFirst(req) {
  const cache = await caches.open(CACHE_NAME);
  const hit = await cache.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
  return res;
}

async function networkFirst(req) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const res = await fetch(req);
    if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
    return res;
  } catch (err) {
    const hit = await cache.match(req);
    if (hit) return hit;
    throw err;
  }
}

async function staleWhileRevalidate(event, url) {
  const key = url.origin + url.pathname; // ignore any ?query so every launch maps to one saved copy
  const cache = await caches.open(CACHE_NAME);
  const hit = await cache.match(key);
  const refresh = fetch(key)
    .then((res) => { if (res && res.ok) cache.put(key, res.clone()); return res; })
    .catch(() => null);
  if (hit) {
    event.waitUntil(refresh);
    return hit;
  }
  const res = await refresh;
  return res || Response.error();
}
