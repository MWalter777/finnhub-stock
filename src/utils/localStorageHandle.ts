import { StockHistory } from '@/types/StockProvider';

const getTimestamp = (date: Date, index: number) => {
	const timestamp = date.getTime() - index * 60000; // Subtract minutes in milliseconds
	return timestamp;
};

// Mock initial data for local storage, just for development/testing purposes
const initialData: StockHistory[] = [
	{
		stock: {
			currency: 'USD',
			description: 'APPLE INC',
			displaySymbol: 'AAPL',
			figi: 'BBG000B9XRY4',
			isin: null,
			mic: 'XNAS',
			shareClassFIGI: 'BBG001S5N8V8',
			symbol: 'AAPL',
			symbol2: '',
			type: 'Common Stock',
		},
		alertPrice: 252,
		prices: [
			{
				timestamp: getTimestamp(new Date(), 6),
				price: 251.9701,
				prevPrice: 247.45,
			},
			{
				prevPrice: 251.9701,
				price: 252.19,
				timestamp: getTimestamp(new Date(), 5),
			},
			{
				prevPrice: 252.19,
				price: 252.19,
				timestamp: getTimestamp(new Date(), 4),
			},
			{
				prevPrice: 252.19,
				price: 252.21,
				timestamp: getTimestamp(new Date(), 3),
			},
			{
				prevPrice: 252.21,
				price: 252.11,
				timestamp: getTimestamp(new Date(), 2),
			},
			{
				prevPrice: 252.11,
				price: 252.09,
				timestamp: getTimestamp(new Date(), 1),
			},
			{
				prevPrice: 252.09,
				price: 252.1,
				timestamp: getTimestamp(new Date(), 0),
			},
		],
	},
	{
		stock: {
			currency: 'USD',
			description: 'AMAZON.COM INC',
			displaySymbol: 'AMZN',
			figi: 'BBG000BVPV84',
			isin: null,
			mic: 'XNAS',
			shareClassFIGI: 'BBG001S5PQL7',
			symbol: 'AMZN',
			symbol2: '',
			type: 'Common Stock',
		},
		alertPrice: 213,
		prices: [
			{
				timestamp: getTimestamp(new Date(), 6),
				price: 213.365,
				prevPrice: 214.47,
			},
			{
				prevPrice: 213.365,
				price: 213.22,
				timestamp: getTimestamp(new Date(), 5),
			},
			{
				prevPrice: 213.22,
				price: 213.21,
				timestamp: getTimestamp(new Date(), 4),
			},
			{
				prevPrice: 213.21,
				price: 213.21,
				timestamp: getTimestamp(new Date(), 3),
			},
			{
				prevPrice: 213.21,
				price: 213.21,
				timestamp: getTimestamp(new Date(), 2),
			},
			{
				prevPrice: 213.21,
				price: 213.24,
				timestamp: getTimestamp(new Date(), 1),
			},
			{
				prevPrice: 213.24,
				price: 213.24,
				timestamp: getTimestamp(new Date(), 0),
			},
		],
	},
];

const SAVE_LAST_50 = 50;
export const lOCAL_STORE_ITEMS = {
	stockHistory: 'stockHistory',
};

/**
 * Saves data in local storage under the specified item name.
 * @param data - The data to be saved.
 * @param itemName - The key under which the data will be stored.
 */
export const saveInLocalStorage = <T>(data: T[], itemName: string) => {
	if (typeof window !== 'undefined') {
		localStorage.setItem(itemName, JSON.stringify(data));
	}
};

/** Saves the latest historical data, keeping only the last 50 price entries for each stock.
 * @param historicalData - The array of StockHistory objects to be saved.
 */
export const saveLastestHistoricalData = (historicalData: StockHistory[]) => {
	const dataToSaved: StockHistory[] = historicalData.map((h) => {
		const last50Prices = h.prices.filter(
			(_, i) => i >= h.prices.length - SAVE_LAST_50
		);
		return {
			...h,
			prices: last50Prices,
		};
	});
	saveInLocalStorage(dataToSaved, lOCAL_STORE_ITEMS.stockHistory);
};

/** Retrieves the stock history data saved in local storage.
 * @returns An array of StockHistory objects.
 */
export const getStocksSavedInLocalStorage = (): StockHistory[] => {
	const storedData = localStorage.getItem(lOCAL_STORE_ITEMS.stockHistory);
	if (storedData) {
		try {
			const parsedData = JSON.parse(storedData) as StockHistory[];
			return parsedData;
		} catch (error) {
			void error;
			return initialData;
		}
	}
	return initialData;
};
