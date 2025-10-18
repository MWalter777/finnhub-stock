import {
	getInitialValueBySymbol,
	getStockSymbols,
} from '@/utils/getStockSymbols';
beforeEach(() => {
	if (!window.fetch) {
		window.fetch = jest.fn();
	}
});

describe('getStockSymbols utility function', () => {
	test('fetchStocks should return an array of stock symbols', async () => {
		// mock fetch call
		const mockStocks = [
			{ symbol: 'AAPL', symbol2: '' },
			{ symbol: 'MSFT', symbol2: 'MSFT' },
			{ symbol: 'GOOGL', symbol2: 'GOOGL' },
		];
		const fetchMock = jest.spyOn(window, 'fetch').mockResolvedValue({
			json: jest.fn().mockResolvedValue(mockStocks),
		} as any);
		const data = await getStockSymbols();
		expect(Array.isArray(data)).toBe(true);
		expect(data.length).toBeGreaterThan(0);
		fetchMock.mockRestore();
	});

	it('should return data from localStorage if available', async () => {
		const mockStocks = [
			{ symbol: 'AAPL', symbol2: 'AAPL' },
			{ symbol: 'MSFT', symbol2: 'ASD' },
		];
		localStorage.setItem('stockSymbols', JSON.stringify(mockStocks));
		const data = await getStockSymbols();
		expect(data).toEqual(mockStocks);
		localStorage.removeItem('stockSymbols');
	});

	it('getInitialValueBySymbol should return current stock price data', async () => {
		const mockPriceData = {
			c: 150.0,
			h: 155.0,
			l: 149.0,
			o: 152.0,
			pc: 148.0,
			t: 1625247600,
		};
		const fetchMock = jest.spyOn(window, 'fetch').mockResolvedValue({
			json: jest.fn().mockResolvedValue(mockPriceData),
		} as any);
		const data = await getInitialValueBySymbol('AAPL');
		expect(data).toEqual(mockPriceData);
		fetchMock.mockRestore();
	});
});
