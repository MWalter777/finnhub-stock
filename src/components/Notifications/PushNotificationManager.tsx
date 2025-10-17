import { Button } from '@mui/material';

const showNotification = async () => {
	if (!('Notification' in window)) {
		alert('This browser does not support notifications.');
		return;
	}

	let permission = Notification.permission;
	if (permission === 'default') {
		permission = await Notification.requestPermission();
	}

	if (permission !== 'granted') {
		alert('Notifications have been denied.');
		return;
	}

	const reg = await navigator.serviceWorker.ready;
	console.log('Service Worker is ready to show notifications.');

	reg.showNotification('📊 Finnhub', {
		body: 'New stock data available!',
		icon: '/manifest-192x192.png',
		badge: '/manifest-192x192.png',
	});
};

export function PushNotificationManager() {
	return <Button onClick={showNotification}>Show notification</Button>;
}

export default PushNotificationManager;
