// Flavorly Service Worker for PWA functionality
const CACHE_NAME = 'flavorly-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/config.js',
  '/favicon.svg',
  '/manifest.json',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
];

// Install event - cache essential files
self.addEventListener('install', event => {
  console.log('🔧 Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Service Worker: Caching essential files');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('✅ Service Worker: Installation complete');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('🚀 Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker: Activation complete');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip external API calls (let them fail naturally)
  if (url.hostname !== 'localhost' && url.hostname !== '127.0.0.1' && !url.hostname.includes('flavorly')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return cached response
        if (response) {
          console.log('📋 Service Worker: Serving from cache:', event.request.url);
          return response;
        }
        
        // Network request
        return fetch(event.request)
          .then(response => {
            // Check if valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone response for caching
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                console.log('💾 Service Worker: Caching new resource:', event.request.url);
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(() => {
            // Offline fallback
            console.log('📱 Service Worker: Offline mode, serving fallback');
            
            // Return offline page for navigation requests
            if (event.request.destination === 'document') {
              return caches.match('/index.html');
            }
            
            // Return offline fallback for other requests
            return new Response('Offline - Content not available', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});

// Background sync for saved recipes
self.addEventListener('sync', event => {
  if (event.tag === 'sync-recipes') {
    console.log('🔄 Service Worker: Background sync for recipes');
    event.waitUntil(syncRecipes());
  }
});

// Push notifications
self.addEventListener('push', event => {
  console.log('📢 Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New recipe update available!',
    icon: '/icon-192x192.png',
    badge: '/icon-96x96.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Explore Recipe',
        icon: '/icon-96x96.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icon-96x96.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Flavorly', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  console.log('🖱️ Service Worker: Notification clicked');
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/?action=recipes')
    );
  }
});

// Sync recipes function
async function syncRecipes() {
  try {
    // Get all clients and sync saved recipes
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_RECIPES',
        timestamp: Date.now()
      });
    });
  } catch (error) {
    console.error('❌ Service Worker: Sync failed:', error);
  }
}

// Message handling from main app
self.addEventListener('message', event => {
  console.log('💬 Service Worker: Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_UPDATE') {
    // Update specific cache entries
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(cache => {
          return cache.add(event.data.url);
        })
    );
  }
});
