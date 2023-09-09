const assets = [
    "./",
    "./index.html",
    "./style.css",
    "app.js",
    "./images/logo192.png",
    "./images/logo512.png",
    "./images/maskable_icon_x192.png"
];

self.addEventListener("install", e => {
    e.waitUntil(
        caches.open("static").then(cache => {
            console.log('caching');
            return cache.addAll(assets);
        })
    );
});

self.addEventListener("fetch", e => {
    e.respondWith(
        caches.match(e.request).then(response => {
            return response || fetch(e.request);
        })
    );
});