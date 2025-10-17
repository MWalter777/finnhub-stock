const CACHE_NAME = 'finnhub-cache-v1';

const urlsToCache = ['/', '/manifest-192x192.png', '/manifest-512x512.png'];

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
	);
	self.skipWaiting();
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((keys) =>
				Promise.all(
					keys
						.filter((key) => key !== CACHE_NAME)
						.map((key) => caches.delete(key))
				)
			)
	);
	self.clients.claim();
});

self.addEventListener('fetch', (event) => {
	const { request } = event;

	if (
		request.url.includes('/api/') ||
		request.url.endsWith('service-worker.js') ||
		request.method !== 'GET'
	)
		return;

	event.respondWith(
		fetch(request)
			.then((networkResponse) => {
				if (
					networkResponse &&
					networkResponse.status === 200 &&
					networkResponse.type === 'basic'
				) {
					const responseToCache = networkResponse.clone();
					caches.open(CACHE_NAME).then((cache) => {
						cache.put(request, responseToCache);
					});
				}
				return networkResponse;
			})
			.catch(async () => {
				const cachedResponse = await caches.match(request);
				if (cachedResponse) {
					return cachedResponse;
				}

				return new Response(JSON.stringify({ error: 'Offline' }), {
					status: 503,
					headers: { 'Content-Type': 'application/json' },
				});
			})
	);
});
