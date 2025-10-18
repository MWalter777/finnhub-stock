import { StockHistory, StockPricePoint } from '@/types/StockProvider';
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
	await Notification.requestPermission();
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
		h: StockHistory,
		newPrice: StockPricePoint
	) => {
		if (newPrice.price < h.alertPrice) {
			const title = `Stock: ${h.stock.symbol} dropped below $${h.alertPrice}`;
			const options: NotificationOptions = {
				body: `Current Price: $${newPrice.price}`,
				icon: '/manifest-192x192.png',
			};
			sendNotification(title, options);
		}
	};

	return { sendCustomNotification };
};

export default useShowNotification;
