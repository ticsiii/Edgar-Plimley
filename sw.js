const CACHE = 'edgar-v7';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './icon.svg', './icon-192.png', './icon-512.png',
  './edgar-adventure.jpg', './edgar-magic.jpg',
  './dice/dice-box.es.min.js', './dice/Dice.min.js', './dice/world.offscreen.min.js', './dice/world.onscreen.min.js', './dice/world.none.min.js',
  './dice/assets/ammo/ammo.wasm.wasm',
  './dice/assets/themes/default/theme.config.json', './dice/assets/themes/default/default.json',
  './dice/assets/themes/default/diffuse-light.png', './dice/assets/themes/default/diffuse-dark.png',
  './dice/assets/themes/default/normal.png', './dice/assets/themes/default/specular.jpg',
  './dice/assets/themes/dichroic/theme.config.json', './dice/assets/themes/dichroic/default.json',
  './dice/assets/themes/dichroic/dichroic-light.jpg', './dice/assets/themes/dichroic/dichroic-dark.jpg',
  './dice/assets/themes/dichroic/normal.png', './dice/assets/themes/dichroic/specular.jpg'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Network-first so Netlify updates show up immediately; cache fallback for offline play.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
