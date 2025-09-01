/*
===============================================
SERVICE WORKER - OFFLINE SUPPORT & CACHING
===============================================
Comprehensive caching strategy for optimal performance
and offline functionality
===============================================
*/

const CACHE_NAME = 'daniel-wanjala-portfolio-v1.0.0';
const STATIC_CACHE = 'static-cache-v1.0.0';
const API_CACHE = 'api-cache-v1.0.0';
const IMAGE_CACHE = 'image-cache-v1.0.0';

// Assets to cache immediately on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/about.html',
  '/projects.html',
  '/blog.html',
  '/contact.html',
  '/assets/main.css',
  '/assets/design-tokens.css',
  '/assets/hero-variations.css',
  '/assets/main.js',
  '/assets/motion-engine.js',
  '/manifest.json',
  // Critical images
  '/assets/images/My_Profile_Photo.jpg',
  '/assets/images/logo.png',
  // Fonts
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap',
  // External libraries
  'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js'
];

// API endpoints to cache
const API_ENDPOINTS = [
  '/assets/data/projects.json',
  '/assets/data/fintech-news.json',
  '/assets/data/github-activity.json',
  '/assets/data/skills.json',
  '/assets/data/tech-news.json'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS.map(url => new Request(url, { cache: 'reload' })));
      }),
      caches.open(API_CACHE).then((cache) => {
        console.log('Service Worker: Caching API endpoints');
        return cache.addAll(API_ENDPOINTS);
      })
    ]).then(() => {
      console.log('Service Worker: Installation complete');
      self.skipWaiting();
    }).catch((error) => {
      console.error('Service Worker: Installation failed', error);
    })
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (![STATIC_CACHE, API_CACHE, IMAGE_CACHE].includes(cacheName)) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activation complete');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve cached content and implement caching strategies
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip Chrome extension requests
  if (url.protocol === 'chrome-extension:') {
    return;
  }

  event.respondWith(
    handleRequest(request)
  );
});

async function handleRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Handle different types of requests with appropriate strategies
    
    // 1. Static assets (HTML, CSS, JS) - Cache First with Network Fallback
    if (isStaticAsset(url)) {
      return await cacheFirst(request, STATIC_CACHE);
    }
    
    // 2. API data - Network First with Cache Fallback
    if (isAPIRequest(url)) {
      return await networkFirst(request, API_CACHE);
    }
    
    // 3. Images - Cache First with Network Fallback
    if (isImageRequest(url)) {
      return await cacheFirst(request, IMAGE_CACHE);
    }
    
    // 4. External resources (fonts, CDN) - Stale While Revalidate
    if (isExternalResource(url)) {
      return await staleWhileRevalidate(request, STATIC_CACHE);
    }
    
    // 5. Default - Network First
    return await networkFirst(request, STATIC_CACHE);
    
  } catch (error) {
    console.error('Service Worker: Request failed', error);
    return await getOfflineFallback(request);
  }
}

// Caching Strategies

async function cacheFirst(request, cacheName) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Cache First failed:', error);
    throw error;
  }
}

async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Network failed, trying cache:', error);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cachedResponse = await caches.match(request);
  
  const networkResponsePromise = fetch(request).then((networkResponse) => {
    if (networkResponse.status === 200) {
      const cache = caches.open(cacheName);
      cache.then(c => c.put(request, networkResponse.clone()));
    }
    return networkResponse;
  }).catch(() => {
    // Network failed, but we might have cached version
  });
  
  return cachedResponse || await networkResponsePromise;
}

// Helper functions to identify request types

function isStaticAsset(url) {
  const staticExtensions = ['.html', '.css', '.js', '.json'];
  const pathname = url.pathname.toLowerCase();
  
  return staticExtensions.some(ext => pathname.endsWith(ext)) ||
         pathname === '/' ||
         pathname.startsWith('/assets/') ||
         url.href.includes('cdnjs.cloudflare.com');
}

function isAPIRequest(url) {
  return url.pathname.startsWith('/api/') ||
         url.pathname.includes('/data/') ||
         url.hostname.includes('api.');
}

function isImageRequest(url) {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.avif'];
  const pathname = url.pathname.toLowerCase();
  
  return imageExtensions.some(ext => pathname.endsWith(ext)) ||
         url.pathname.startsWith('/assets/images/') ||
         url.hostname.includes('images') ||
         request.destination === 'image';
}

function isExternalResource(url) {
  return url.hostname !== self.location.hostname &&
         (url.hostname.includes('fonts.googleapis.com') ||
          url.hostname.includes('fonts.gstatic.com') ||
          url.hostname.includes('cdnjs.cloudflare.com'));
}

// Offline fallbacks
async function getOfflineFallback(request) {
  const url = new URL(request.url);
  
  // Return cached version of index.html for navigation requests
  if (request.mode === 'navigate') {
    const cachedResponse = await caches.match('/index.html');
    if (cachedResponse) {
      return cachedResponse;
    }
  }
  
  // Return offline page for other requests
  return new Response(
    JSON.stringify({
      error: 'You are currently offline',
      message: 'Please check your internet connection and try again.',
      timestamp: new Date().toISOString()
    }),
    {
      status: 503,
      statusText: 'Service Unavailable',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    }
  );
}

// Background sync for form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'contact-form-sync') {
    event.waitUntil(syncContactForm());
  }
});

async function syncContactForm() {
  try {
    const cache = await caches.open('form-data');
    const requests = await cache.keys();
    
    for (const request of requests) {
      const response = await cache.match(request);
      const formData = await response.json();
      
      // Attempt to send the form data
      const result = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (result.ok) {
        await cache.delete(request);
        console.log('Form data synced successfully');
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Push notification handling
self.addEventListener('push', (event) => {
  if (!event.data) {
    return;
  }
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/assets/images/logo.png',
    badge: '/assets/images/logo.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/'
    },
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/assets/images/icon-view.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/assets/images/icon-close.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'view') {
    const url = event.notification.data.url || '/';
    event.waitUntil(
      clients.openWindow(url)
    );
  }
});

// Performance monitoring
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({
      version: CACHE_NAME
    });
  }
});

// Cache management utilities
async function cleanupCaches() {
  const cacheNames = await caches.keys();
  const currentCaches = [STATIC_CACHE, API_CACHE, IMAGE_CACHE];
  
  return Promise.all(
    cacheNames.map((cacheName) => {
      if (!currentCaches.includes(cacheName)) {
        console.log('Deleting outdated cache:', cacheName);
        return caches.delete(cacheName);
      }
    })
  );
}

// Periodic cache cleanup
setInterval(cleanupCaches, 24 * 60 * 60 * 1000); // 24 hours

console.log('Service Worker: Loaded and ready');

// Export for testing purposes
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    cacheFirst,
    networkFirst,
    staleWhileRevalidate,
    isStaticAsset,
    isAPIRequest,
    isImageRequest,
    isExternalResource
  };
}
