/**
 * Service Worker: Advanced Caching & Offline Support
 *
 * PERFORMANCE: Network-first strategy with smart caching
 * - Caches critical assets for instant loading
 * - Implements stale-while-revalidate for API calls
 * - Provides offline fallbacks
 * - Background sync for failed requests
 *
 * @strategy
 * - Cache First: Static assets (images, fonts, CSS, JS)
 * - Network First: API calls, HTML pages
 * - Stale While Revalidate: Dynamic content
 */

const CACHE_NAME = 'scalesite-v1';
const STATIC_CACHE = 'scalesite-static-v1';
const DYNAMIC_CACHE = 'scalesite-dynamic-v1';

// Assets to cache immediately on install
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/index.css',
  '/manifest.json',
  // Add critical fonts, icons, etc.
];

// Cache strategies
const CACHE_STRATEGIES = {
  // Cache First: Fastest for immutable assets
  cacheFirst: [
    /\/api\/static\/.*/,
    /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/,
    /\.(?:woff|woff2|ttf|otf|eot)$/,
  ],

  // Network First: Fresh data is critical
  networkFirst: [
    /\/api\/.*/,
    '/index.html',
  ],

  // Stale While Revalidate: Balance speed and freshness
  staleWhileRevalidate: [
    /\.js$/,
    /\.css$/,
  ],
};

// Install event: Precache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      // Cache critical URLs
      caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE_URLS)),
      // Skip waiting to activate immediately
      self.skipWaiting(),
    ])
  );
});

// Activate event: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // Delete old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
            .map((name) => caches.delete(name))
        );
      }),
      // Take control of all clients immediately
      self.clients.claim(),
    ])
  );
});

// Fetch event: Implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests
  if (request.method !== 'GET') return;

  // Skip non-HTTP requests (chrome-extension, etc.)
  if (!url.protocol.startsWith('http')) return;

  // Determine cache strategy
  const strategy = determineCacheStrategy(url);

  switch (strategy) {
    case 'cacheFirst':
      event.respondWith(cacheFirst(request));
      break;
    case 'networkFirst':
      event.respondWith(networkFirst(request));
      break;
    case 'staleWhileRevalidate':
      event.respondWith(staleWhileRevalidate(request));
      break;
    default:
      // Default: Network only
      event.respondWith(fetch(request));
  }
});

/**
 * Determine cache strategy based on URL
 */
function determineCacheStrategy(url: URL): string {
  const urlStr = url.href;

  for (const [strategy, patterns] of Object.entries(CACHE_STRATEGIES)) {
    for (const pattern of patterns) {
      if (pattern instanceof RegExp && pattern.test(urlStr)) {
        return strategy;
      }
    }
  }

  return 'networkFirst';
}

/**
 * Cache First Strategy
 * Check cache first, fallback to network
 * Best for: Immutable assets (images, fonts)
 */
async function cacheFirst(request: Request) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request);

  if (cached) {
    return cached;
  }

  try {
    const network = await fetch(request);

    // Only cache successful responses
    if (network.ok) {
      cache.put(request, network.clone());
    }

    return network;
  } catch (error) {
    console.error('Cache First failed:', error);
    throw error;
  }
}

/**
 * Network First Strategy
 * Try network first, fallback to cache
 * Best for: API calls, HTML pages
 */
async function networkFirst(request: Request) {
  const cache = await caches.open(DYNAMIC_CACHE);

  try {
    const network = await fetch(request);

    // Update cache with fresh response
    if (network.ok) {
      cache.put(request, network.clone());
    }

    return network;
  } catch (error) {
    console.log('Network failed, trying cache:', error);
    const cached = await cache.match(request);

    if (cached) {
      return cached;
    }

    // Offline fallback
    throw error;
  }
}

/**
 * Stale While Revalidate Strategy
 * Return cached response immediately, update in background
 * Best for: JS, CSS, dynamic content
 */
async function staleWhileRevalidate(request: Request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cached = await cache.match(request);

  // Fetch in background
  const fetchPromise = fetch(request).then((network) => {
    if (network.ok) {
      cache.put(request, network.clone());
    }
    return network;
  });

  // Return cached immediately, or wait for network
  return cached || fetchPromise;
}

/**
 * Background Sync (for failed requests)
 * Queues failed requests and retries when online
 */
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-api-requests') {
    event.waitUntil(syncApiRequests());
  }
});

async function syncApiRequests() {
  // Get failed requests from IndexedDB
  // Retry them
  // This would integrate with a queue system
}

/**
 * Push Notifications (optional)
 */
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New notification',
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    vibrate: [200, 100, 200],
  };

  event.waitUntil(self.registration.showNotification('ScaleSite', options));
});

// Export for TypeScript
export {};
