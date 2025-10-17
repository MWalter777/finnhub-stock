import { StockHistory } from './StockProvider';
import { PriceRecord } from './StockSocket';

export type UseStockSocketReturn = {
	history: StockHistory[];
	subscribeNewStock: (history: StockHistory) => void;
	unsubscribeStock: (symbol: string) => void;
};
