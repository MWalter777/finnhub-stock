import { useOnlineStatus } from '@/hook/useOnlineStatus';
import { renderHook } from '@testing-library/react';

describe('useOnlineStatus', () => {
	test('should be online', () => {
		const { result } = renderHook(() => useOnlineStatus());
		expect(result.current.isOnline).toBe(true);
	});

	test('should be offline', () => {
		// mock navigator.onLine to be false
		Object.defineProperty(navigator, 'onLine', {
			value: false,
			configurable: true,
		});
		const { result } = renderHook(() => useOnlineStatus());
		expect(result.current.isOnline).toBe(false);
	});

	test('should handle status change', () => {
		// mock window.addEventListener
		const originalAddEventListener = window.addEventListener;
		Object.defineProperty(window, 'addEventListener', {
			value: jest.fn((event, handler) => {
				if (event === 'online') {
					handler();
				}
				if (event === 'offline') {
					handler();
				}
			}),
			configurable: true,
		});
		const { result } = renderHook(() => useOnlineStatus());
		expect(result.current.isOnline).toBe(false);
		// restore original addEventListener
		window.addEventListener = originalAddEventListener;
	});

	it('should set true if there is no valid value for navigator', () => {
		// mock navigator to be undefined
		const originalNavigator = Object.getOwnPropertyDescriptor(
			window,
			'navigator'
		);
		Object.defineProperty(window, 'navigator', {
			value: undefined,
			configurable: true,
		});
		const { result } = renderHook(() => useOnlineStatus());
		expect(result.current.isOnline).toBe(true);
		// restore original navigator
		if (originalNavigator) {
			Object.defineProperty(window, 'navigator', originalNavigator);
		}
	});
});
