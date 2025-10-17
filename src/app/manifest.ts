import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: 'Finnhub stock PWA',
		short_name: 'FinnhubPWA',
		description: 'A Progressive Web App built with Next.js',
		start_url: '/',
		id: '/',
		display: 'standalone',
		background_color: '#ffffff',
		theme_color: '#000000',
		icons: [
			{
				src: '/manifest-192x192.png',
				sizes: '192x192',
				type: 'image/png',
			},
			{
				src: '/manifest-512x512.png',
				sizes: '512x512',
				type: 'image/png',
			},
		],
	};
}
