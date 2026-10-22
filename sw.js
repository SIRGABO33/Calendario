const C = 'calendario-v15';
const F = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(F))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(n => n !== C).map(n => caches.delete(n))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  const q = e.request;
  if (q.method !== 'GET' || new URL(q.url).origin !== location.origin) return;
  e.respondWith((async () => {
    const cache = await caches.open(C);
    try {
      const r = await Promise.race([fetch(q), new Promise((_, no) => setTimeout(no, 3500))]);
      if (r && r.ok) cache.put(q, r.clone());
      return r;
    } catch (_) {
      return (await cache.match(q)) || (await cache.match('index.html'));
    }
  })());
});
