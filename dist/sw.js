const cacheName  = "sw-cache-v1";

const files = [
  "/manifest.webmanifest",
  "/index.html",
  "/resume/index.html",
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

const handleInstall = async () => {
  const cache = await caches.open(cacheName);
  return cache.addAll(files);
};

self.addEventListener('install', (e) => e.waitUntil(handleInstall()));

const handleActivate = async () => {
  const keyList = await caches.keys();
  keyList.forEach(key => {
    if (key !== cacheName) {
      caches.delete(key);
    }
  });
};

self.addEventListener('activate', e => e.waitUntil(handleActivate()));

const handleFetch = async (req) => {
  try {
    const res = await fetch(req);
    if (res.ok) {
      const cache = await caches.open(cacheName);
      cache.put(req, res.clone());
      return res;
    } else {
      throw Error(`Request returned a ${res.status}: ${res.statusText}`);
    }
  } catch (err) {
    console.warn(`SW: An error occured while fetching ${req.url} (${req.method})`);
    console.warn(err);
    return await caches.match(req);
  }
};

self.addEventListener('fetch', e => e.respondWith(handleFetch(e.request)));
