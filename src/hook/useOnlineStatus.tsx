import { useState, useEffect } from 'react';

/**
 * Custom hook to monitor the online/offline status of the browser.
 * @returns An object containing the isOnline boolean.
 */
export const useOnlineStatus = () => {
	const [isOnline, setIsOnline] = useState(
		typeof navigator !== 'undefined' ? navigator.onLine : true
	);

	useEffect(() => {
		const handleOnline = () => setIsOnline(true);
		const handleOffline = () => setIsOnline(false);

		window.addEventListener('online', handleOnline);
		window.addEventListener('offline', handleOffline);

		// Cleanup
		return () => {
			window.removeEventListener('online', handleOnline);
			window.removeEventListener('offline', handleOffline);
		};
	}, []);

	return { isOnline };
};
