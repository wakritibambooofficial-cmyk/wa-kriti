// const CACHE_NAME = 'wakriti-cache-v1';
// const OFFLINE_URL = '/offline.html';
// const APP_SHELL = ['/', '/offline.html', '/manifest.json', '/favicon.svg'];

// self.addEventListener('install', (event) => {
//   event.waitUntil(
//     caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
//   );
// });

// self.addEventListener('activate', (event) => {
//   event.waitUntil(
//     caches
//       .keys()
//       .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
//       .then(() => self.clients.claim())
//   );
// });

// self.addEventListener('fetch', (event) => {
//   // Only handle GET navigation requests specially; let API/POST calls pass through untouched.
//   if (event.request.method !== 'GET') return;

//   if (event.request.mode === 'navigate') {
//     event.respondWith(
//       fetch(event.request).catch(() => caches.match(OFFLINE_URL))
//     );
//     return;
//   }

//   event.respondWith(
//     caches.match(event.request).then((cached) => cached || fetch(event.request).catch(() => cached))
//   );
// });


const CACHE_NAME = 'wakriti-cache-v2'; // bumped so old caches get cleared
const OFFLINE_URL = '/offline.html';
const APP_SHELL = ['/', '/offline.html', '/manifest.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      // add files one by one so a single missing file doesn't break the install
      Promise.all(APP_SHELL.map((url) => cache.add(url).catch(() => {})))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Ignore non-GET, other origins (Google Fonts, YouTube, etc.), admin and API
  if (req.method !== 'GET') return;
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/api')) return;

  // Page loads: network first, offline page as fallback
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(
        async () =>
          (await caches.match(OFFLINE_URL)) ||
          new Response('You are offline', { status: 503, headers: { 'Content-Type': 'text/plain' } })
      )
    );
    return;
  }

  // Other files: cache first, then network, and always return a real Response
  event.respondWith(
    caches.match(req).then(
      (cached) =>
        cached ||
        fetch(req).catch(() => new Response('', { status: 504, statusText: 'Offline' }))
    )
  );
});