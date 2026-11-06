// Trade Replay service worker: app shell network-first, price data cache-first (history never changes;
// files that do change - the newest month, H1, tick weeks - are fetched as name.wasm?v=<version> and replace the older copy).
const SHELL = 'tr-shell-v82', DATA = 'tr-data-v1';
const CORE = ['./', './index.html', './lw.js', './nt.js', './sb.js', './config.js', './manifest.webmanifest', './icon-192.png', './d/index.json'];
self.addEventListener('install', e => { e.waitUntil(caches.open(SHELL).then(c => c.addAll(CORE)).catch(() => {})); self.skipWaiting(); });
self.addEventListener('activate', e => e.waitUntil((async () => {
  for (const k of await caches.keys()) if (k !== SHELL && k !== DATA) await caches.delete(k);
  await self.clients.claim();
})()));
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  if (u.pathname.endsWith('.wasm')) {
    e.respondWith(caches.open(DATA).then(async c => {
      const hit = await c.match(e.request); if (hit) return hit;
      const r = await fetch(e.request);
      if (r.ok) { await c.put(e.request, r.clone()); for (const k of await c.keys()) { const ku = new URL(k.url); if (ku.pathname === u.pathname && k.url !== e.request.url) c.delete(k); } }
      return r;
    }));
    return;
  }
  e.respondWith(fetch(e.request, { cache: 'no-cache' }).then(r => { if (r.ok) { const cl = r.clone(); caches.open(SHELL).then(c => c.put(e.request, cl)); } return r; })
    .catch(() => caches.match(e.request).then(h => h || caches.match('./index.html'))));
});
