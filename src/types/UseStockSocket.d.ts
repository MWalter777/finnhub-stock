import { StockHistory } from './StockProvider';

export type UseStockSocketReturn = {
	history: StockHistory[];
	subscribeNewStock: (history: StockHistory) => void;
	unsubscribeStock: (symbol: string) => void;
	toggleSocketConnection: () => void;
	isEnabledSocket: boolean;
};
