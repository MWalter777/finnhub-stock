import { StockHistory } from '@/types/StockProvider';

const SAVE_LAST_50 = 50;
export const lOCAL_STORE_ITEMS = {
	stockHistory: 'stockHistory',
};

export const saveInLocalStorage = <T>(data: T[], itemName: string) => {
	if (typeof window !== 'undefined') {
		localStorage.setItem(itemName, JSON.stringify(data));
	}
};

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

export const getStocksSavedInLocalStorage = (): StockHistory[] => {
	if (typeof window !== 'undefined') {
		const storedData = localStorage.getItem(lOCAL_STORE_ITEMS.stockHistory);
		if (storedData) {
			try {
				const parsedData = JSON.parse(storedData) as StockHistory[];
				return parsedData;
			} catch (error) {
				console.error('Error parsing stock history from localStorage:', error);
			}
		}
	}
	return [];
};
