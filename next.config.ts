import type { NextConfig } from 'next';

/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
	dest: 'public',
	register: true,
	skipWaiting: true,
	disable: process.env.NODE_ENV === 'development',
	runtimeCaching: [
		{
			urlPattern: /^https:\/\/.*\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
			handler: 'CacheFirst',
			options: {
				cacheName: 'images-cache',
				expiration: {
					maxEntries: 100,
					maxAgeSeconds: 30 * 24 * 60 * 60,
				},
			},
		},
		{
			urlPattern: /^https:\/\/finnhub\.io\/api\/v1\/.*$/,
			handler: 'CacheFirst',
			options: {
				cacheName: 'finnhub-cache',
				expiration: {
					maxEntries: 100,
					maxAgeSeconds: 60 * 60 * 6,
				},
				cacheableResponse: {
					statuses: [0, 200],
				},
			},
		},
		{
			urlPattern: /^https:\/\/.*\.(?:js|css)$/,
			handler: 'StaleWhileRevalidate',
			options: {
				cacheName: 'static-resources',
				expiration: {
					maxEntries: 60,
					maxAgeSeconds: 7 * 24 * 60 * 60,
				},
			},
		},
	],
});

const nextConfig: NextConfig = {
	compiler: {
		styledComponents: true,
	},
};

export default withPWA(nextConfig);
