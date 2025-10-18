import { StockPricePoint } from '@/types/StockProvider';
import { useEffect } from 'react';

const askPermission = async () => {
	if (!('Notification' in window)) {
		console.log('This browser does not support notifications.');
		return;
	}
	if (Notification.permission === 'granted') {
		console.log('Notification permission already granted.');
		return;
	}
	const permission = await Notification.requestPermission();
	if (permission === 'granted') {
		console.log('Notification permission granted.');
	} else {
		console.log('Notification permission denied.');
	}
};

const sendNotification = (title: string, options: NotificationOptions) => {
	if (Notification.permission === 'granted') {
		const payload = JSON.stringify({ title, options });
		navigator.serviceWorker.ready.then((reg) => {
			if (reg.active) {
				reg.active.postMessage({ type: 'stock', payload });
			}
		});
	}
};

export const useShowNotification = () => {
	useEffect(() => {
		askPermission();
	}, []);

	const sendCustomNotification = (
		symbol: string,
		newPrice: StockPricePoint
	) => {
		const title = `Stock: ${symbol}`;
		const options: NotificationOptions = {
			body: `New price: $${newPrice.price.toFixed(
				2
			)} (Previous: $${newPrice.prevPrice.toFixed(2)})`,
			icon: '/icon-192x192.png',
		};
		sendNotification(title, options);
	};

	return { sendCustomNotification };
};

export default useShowNotification;
