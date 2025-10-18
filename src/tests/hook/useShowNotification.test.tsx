import useShowNotification from '@/hook/useShowNotification';
import { renderHook } from '@testing-library/react';
import { act } from 'react';

// mock console.log
jest.spyOn(console, 'log').mockImplementation((value) => {
	// do nothing
});

describe('useShowNotification', () => {
	it('should be defined', () => {
		const { result } = renderHook(() => useShowNotification());
		expect(result.current).toBeDefined();
		// console.log should have been called with 'This browser does not support notifications.'
		expect(console.log).toHaveBeenCalledWith(
			'This browser does not support notifications.'
		);
	});

	it('simulate Notification supported and permission granted', () => {
		// mock Notification in window
		Object.defineProperty(window, 'Notification', {
			value: {
				permission: 'granted',
				requestPermission: jest.fn().mockResolvedValue('granted'),
			},
			writable: true,
		});
		const { result } = renderHook(() => useShowNotification());
		expect(result.current).toBeDefined();
		// console.log should have been called with 'Notification permission already granted.'
		expect(console.log).toHaveBeenCalledWith(
			'Notification permission already granted.'
		);
	});

	it('simulate Notification supported and permission requested', async () => {
		// mock Notification in window
		Object.defineProperty(window, 'Notification', {
			value: {
				permission: 'default',
				requestPermission: () => 'granted',
			},
			writable: true,
		});
		const { result } = renderHook(() => useShowNotification());
		expect(result.current).toBeDefined();
		expect(console.log).toHaveBeenCalledTimes(0);
	});

	it('should send custom notification', async () => {
		// mock Notification in window
		const mockPostMessage = jest.fn();
		Object.defineProperty(window, 'Notification', {
			value: {
				permission: 'granted',
				requestPermission: () => 'granted',
			},
			writable: true,
		});
		// mock navigator.serviceWorker.ready
		Object.defineProperty(navigator, 'serviceWorker', {
			value: {
				ready: Promise.resolve({
					active: {
						postMessage: mockPostMessage,
					},
				}),
			},
			writable: true,
		});
		const { result } = renderHook(() => useShowNotification());
		await act(async () => {
			result.current.sendCustomNotification(
				{
					alertPrice: 160,
					stock: {
						symbol: 'AAPL',
						description: 'Apple Inc.',
					},
					prices: [],
				} as any,
				{
					price: 150,
					prevPrice: 145,
				} as any
			);
		});
		expect(mockPostMessage).toHaveBeenCalledWith({
			type: 'stock',
			payload: JSON.stringify({
				title: 'Stock: AAPL dropped below $160',
				options: {
					body: 'Current Price: $150',
					icon: '/manifest-192x192.png',
				},
			}),
		});
	});
});
