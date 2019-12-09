'use strict';

self.addEventListener('push', function(event) {
   console.log('[Service Worker] Push Received.');
   console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);
    const title = 'Push Codelab';
   const options = {
     body: event.data.text(),
     icon: 'icon-128x128.png',
     badge: 'icon-128x128.png'
   };
    event.waitUntil(self.registration.showNotification(title, options));
 });

self.addEventListener('notificationclick', function(event) {
 console.log('[Service Worker] Notification click Received.');

 event.notification.close();

 event.waitUntil(
 clients.openWindow('https://miparcela.bubbleapps.io/version-test/')
 );
});

// CACHE
const cacheName = 'cache-v1';
const resourcesToPrecache = [
   '/',
   "index.html"
];

self.addEventListener('install', event => {
   console.log("SW install event");
   event.waitUntil(
       caches.open(cacheName)
           .then(cache => {
               return cache.addAll(resourcesToPrecache);
           })
           .catch(err => {
               console.log(err);
           })
   );
});

self.addEventListener('fetch', event => {
   event.respondWith(caches.match(event.request)
       .then(cachedResponse => {
           return cachedResponse || fetch(event.request);
       })
   );
});
