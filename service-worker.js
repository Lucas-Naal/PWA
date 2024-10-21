self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open('pwa-blog-cache').then((cache) => {
        return cache.addAll([
          '/',
          '/index.html',
          '/css/styles.css',
          '/js/app.js',
          '/js/crud.js',
          '/img/icon.png',
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  });
  