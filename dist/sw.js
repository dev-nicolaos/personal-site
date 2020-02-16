const cacheName = "sw-cache";
const files = [
  "/manifest.webmanifest",
  "/index.html",
  "/resume.html",
  // JS
  "/js/utility-belt.js",
  "/js/items.js",
  // Styling
  "/styles/index.css",
  "/styles/resume.css",
  "/styles/animations.css",
  "/styles/colors.css",
  "/styles/layout.css",
  "/styles/reset.css",
  "/styles/typography.css",
  "/styles/sections/bio.css",
  "/styles/sections/header.css",
  "/styles/sections/resume-header.css",
  "/styles/sections/utility-belt.css",
  // Icons
  "/favicon.ico",
  "/assets/icons/logo-48.webp",
  "/assets/icons/logo-48.png",
  "/assets/icons/logo-192.webp",
  "/assets/icons/logo-192.png",
  "/assets/icons/logo-512.webp",
  "/assets/icons/logo-512.png",
  // Fonts
  "/assets/fonts/PublicSans-Regular.woff2",
  // Images,
  "/assets/img/logo.svg",
  "/assets/img/nicolaos.webp",
  "/assets/img/nicolaos-wide.webp",
];

self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(cacheRes =>
      cacheRes || fetch(e.request).then(fetchRes =>
        caches.open(cacheName).then(cache => {
          cache.put(e.request, fetchRes.clone());
          return fetchRes;
        })
      )
    )
  );
});
