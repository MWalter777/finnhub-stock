import useShowNotification from '@/hook/useShowNotification';
import useStockSocket from '@/hook/useStockSocket';
import { StreamStockPrice } from '@/types/Stock';
import { renderHook } from '@testing-library/react';
import { act } from 'react';

// mock useOnlineStatus
jest.mock('@/hook/useOnlineStatus', () => ({
	useOnlineStatus: jest.fn(() => ({ isOnline: true })),
}));

// mock WebSocket
class MockWebSocket {
	constructor() {}

	onopen: () => void = () => {};
	onmessage: (event: { data: string }) => void = () => {};
	readyState = 1; // OPEN
	static OPEN = 1;
	send = jest.fn();
	close = jest.fn();
	addEventListener = (type: string, listener: (event: any) => void) => {
		const data: {
			type: string;
			data: StreamStockPrice[];
		} = {
			type: 'trade',
			data: [
				{
					s: 'AAPL',
					p: 150.0,
					t: 1627849923000,
					v: 100,
				},
			],
		};
		if (type === 'open') {
			listener({});
		} else if (type === 'message') {
			listener({ data: JSON.stringify(data) });
			listener({ data: JSON.stringify(data) });
			listener({
				data: JSON.stringify({
					type: 'trade',
					data: [
						{
							s: 'nonSubscribedSymbol',
							p: 151.0,
							t: 1627849983000,
							v: 200,
						},
					],
				}),
			});
		}
	};
}

jest.mock('@/utils/localStorageHandle', () => ({
	getStocksSavedInLocalStorage: jest.fn(() => [
		{ stock: { symbol: 'AAPL' }, prices: [] },
	]),
	saveLastestHistoricalData: jest.fn(),
}));

jest.mock('@/hook/useShowNotification', () => ({
	useShowNotification: jest.fn(() => ({
		sendCustomNotification: jest.fn(),
	})),
}));

describe('useStockSocket', () => {
	let originalWebSocket: any;
	beforeAll(() => {
		originalWebSocket = (global as any).WebSocket;
		(global as any).WebSocket = MockWebSocket;
	});

	afterAll(() => {
		(global as any).WebSocket = originalWebSocket;
	});

	it('useStockSocket should return UseStockSocketReturn', () => {
		const {
			result: { current: result },
		} = renderHook(() => useStockSocket(true));
		expect(result).toHaveProperty('history');
		expect(result).toHaveProperty('subscribeNewStock');
		expect(result).toHaveProperty('unsubscribeStock');
	});

	it('should handle incoming WebSocket messages and update history', () => {
		const { result } = renderHook(() => useStockSocket(true));
		expect(result.current.history.length).toBe(1); // Initial history length
		act(() => {
			expect(result.current.history[0].prices.length).toBe(2); // Updated history length
		});
	});

	it('unsubscribeStock should remove stock from history', () => {
		const { result } = renderHook(() => useStockSocket(true));
		act(() => {
			result.current.unsubscribeStock('AAPL');
		});
		expect(result.current.history.length).toBe(0);
	});

	it('subscribeNewStock should add new stock to history', () => {
		const { result } = renderHook(() => useStockSocket(true));
		act(() => {
			result.current.subscribeNewStock({
				stock: { symbol: 'MSFT' },
				prices: [],
			} as any);
		});
		expect(result.current.history.length).toBe(2);
		expect(result.current.history[1].stock.symbol).toBe('MSFT');
	});
});
