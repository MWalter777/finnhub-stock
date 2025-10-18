import MultiGraphs from '@/components/GraphStocks/MultiGraphs';
import { StockHistory } from '@/types/StockProvider';

import { render, screen } from '@testing-library/react';
jest.spyOn(console, 'warn').mockImplementation(() => {});
const stockHistory: StockHistory[] = [
	{
		stock: { symbol: 'AAPL', symbol2: 'Apple Inc.' },
		prices: [
			{ timestamp: 1622505600000, prevPrice: 122, price: 125.0 },
			{ timestamp: 1622592000000, prevPrice: 122, price: 127.0 },
			{ timestamp: 1622678400000, prevPrice: 122, price: 126.5 },
		],
	},
	{
		stock: { symbol: 'GOOGL', symbol2: 'Alphabet Inc.' },
		prices: [
			{ timestamp: 1622505600000, prevPrice: 122, price: 2400.0 },
			{ timestamp: 1622592000000, prevPrice: 122, price: 2425.0 },
			{ timestamp: 1622678400000, prevPrice: 122, price: 2410.0 },
		],
	} as any,
];

class ResizeObserver {
	observe() {}
	unobserve() {}
	disconnect() {}
}
(global as any).ResizeObserver = ResizeObserver;

Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: jest.fn().mockImplementation((query) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: jest.fn(),
		removeListener: jest.fn(),
		addEventListener: jest.fn(),
		removeEventListener: jest.fn(),
		dispatchEvent: jest.fn(),
	})),
});

describe('MultiGraphs', () => {
	it('MultiGraphs display graphs', () => {
		render(<MultiGraphs stockHistory={stockHistory} />);
		expect(screen.getByText('AAPL')).toBeInTheDocument();
		expect(screen.getByText('GOOGL')).toBeInTheDocument();
	});
});
