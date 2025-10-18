import { StockHistory, StockPricePoint } from '@/types/StockProvider';
import { useEffect, useRef, useState } from 'react';

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
	const stocksAlertedRef = useRef<Set<string>>(new Set());

	useEffect(() => {
		askPermission();
	}, []);

	const sendCustomNotification = (
		h: StockHistory,
		newPrice: StockPricePoint
	) => {
		if (
			newPrice.price < h.alertPrice &&
			!stocksAlertedRef.current.has(h.stock.symbol)
		) {
			console.log('Sending notification for', h.stock.symbol);
			const title = `Stock: ${h.stock.symbol} dropped below $${h.alertPrice}`;
			const options: NotificationOptions = {
				body: `Current Price: $${newPrice.price}`,
				icon: '/manifest-192x192.png',
			};
			stocksAlertedRef.current = new Set([
				...stocksAlertedRef.current,
				h.stock.symbol,
			]);
			sendNotification(title, options);
		} else {
			console.log('No notification sent for', h.stock.symbol);
		}
	};

	return { sendCustomNotification };
};

export default useShowNotification;
