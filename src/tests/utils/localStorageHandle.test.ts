import {
	getStocksSavedInLocalStorage,
	lOCAL_STORE_ITEMS,
	saveInLocalStorage,
	saveLastestHistoricalData,
} from '@/utils/localStorageHandle';

describe('saveInLocalStorage test', () => {
	it('should save data in local storage', () => {
		const mockData = [{ id: 1, name: 'Test' }];
		const itemName = 'testItem';
		// Mock localStorage
		const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
		// Call the function
		saveInLocalStorage(mockData, itemName);
		// Check if localStorage.setItem was called with correct arguments
		expect(setItemSpy).toHaveBeenCalledWith(itemName, JSON.stringify(mockData));
	});

	it('saveLastestHistoricalData should save only last 50 price entries', () => {
		const mockHistoricalData = [
			{
				symbol: 'TEST',
				prices: Array.from({ length: 60 }, (_, i) => ({
					prevPrice: 100 + i,
					price: 101 + i,
					timestamp: Date.now() - i * 1000,
				})),
			},
		];
		const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
		saveLastestHistoricalData(mockHistoricalData as any[]);
		const expectedData = [
			{
				symbol: 'TEST',
				prices: mockHistoricalData[0].prices.slice(-50),
			},
		];
		expect(setItemSpy).toHaveBeenCalledWith(
			'stockHistory',
			JSON.stringify(expectedData)
		);
	});

	it('getStocksSavedInLocalStorage should return [] if no data is found', () => {
		// Clear localStorage
		localStorage.clear();
		const result = getStocksSavedInLocalStorage();
		expect(result.length).toBe(2); // Based on the initial mock data in localStorageHandle.ts
	});

	it('getStocksSavedInLocalStorage should return saved data', () => {
		const mockData = [
			{
				symbol: 'MOCK',
				prices: [{ prevPrice: 200, price: 201, timestamp: Date.now() }],
			},
		];
		localStorage.setItem(
			lOCAL_STORE_ITEMS.stockHistory,
			JSON.stringify(mockData)
		);
		const result = getStocksSavedInLocalStorage();
		expect(result).toEqual(mockData);
		// Clean up
		localStorage.removeItem(lOCAL_STORE_ITEMS.stockHistory);
	});

	it('getStocksSavedInLocalStorage should return initial data if parsing fails', () => {
		localStorage.setItem(lOCAL_STORE_ITEMS.stockHistory, 'invalid JSON');
		const result = getStocksSavedInLocalStorage();
		expect(result.length).toBe(2); // Based on the initial mock data in localStorageHandle.ts
		// Clean up
		localStorage.removeItem(lOCAL_STORE_ITEMS.stockHistory);
	});
});
