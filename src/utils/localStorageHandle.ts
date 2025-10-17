import { StockHistory } from '@/types/StockProvider';
import { PriceRecord } from '@/types/StockSocket';

export const saveInLocalStorage = <T>(data: T[], itemName: string) => {
	if (typeof window !== 'undefined' && data.length > 0) {
		localStorage.setItem(itemName, JSON.stringify(data));
	}
};

export const getStocksSavedInLocalStorage = (): StockHistory[] => {
	if (typeof window !== 'undefined') {
		const storedData = localStorage.getItem('stockHistory');
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
