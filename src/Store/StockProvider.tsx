import React, {
	createContext,
	ReactElement,
	useContext,
	useEffect,
	useState,
} from 'react';
import { IStock } from '../types/Stock';
import useStockSocket from '../hook/useStockSocket';
import {
	getInitialValueBySymbol,
	getStockSymbols,
} from '../utils/getStockSymbols';
import { PriceRecord } from '../types/StockSocket';
import { StockHistory, StockPricePoint } from '../types/StockProvider';
import { getStocksSavedInLocalStorage } from '@/utils/localStorageHandle';

type StockContext = {
	stocks: IStock[];
	stockHistory: StockHistory[];
};

type StockActionContext = {
	addStockHistory: (stock: IStock, alertPrice: number) => Promise<void>;
	removeStock: (symbol: string) => void;
};

type StockFullContext = StockContext & StockActionContext;

const defaultState: StockFullContext = {
	stocks: [],
	stockHistory: [],
	addStockHistory: async () => {},
	removeStock: () => {},
};

const stockContext = createContext<StockFullContext>(defaultState);

type Props = {
	children: ReactElement | ReactElement[];
};
/**
 * StockProvider component to manage stock data and provide it via context.
 * It uses the useStockSocket hook to handle real-time stock price updates
 * and maintains a list of available stocks and their historical data.
 * @param children - The child components that will have access to the stock context.
 * @returns A context provider wrapping the children components.
 */
const StockProvider = ({ children }: Props) => {
	const [stocks, setStocks] = useState<IStock[]>([]);
	const {
		history: stockHistory,
		subscribeNewStock,
		unsubscribeStock,
	} = useStockSocket();

	const updateHistoricalStock = async (stock: IStock, alertPrice: number) => {
		const initialData = await getInitialValueBySymbol(stock.symbol);
		const prices: StockPricePoint[] = initialData?.c
			? [
					{
						timestamp: new Date().getTime(),
						price: initialData.c,
						prevPrice: initialData.pc,
					},
			  ]
			: [];
		const newStock: StockHistory = {
			stock,
			alertPrice,
			prices,
		};
		const removedStockInUse = stocks.filter((s) => s.symbol !== stock.symbol);
		setStocks(removedStockInUse);
		subscribeNewStock(newStock);
	};

	const removeStock = (symbol: string) => {
		const stock = stockHistory.find((s) => s.stock.symbol === symbol);
		if (!stock) return;
		const newListStocks: IStock[] = [stock.stock, ...stocks];
		setStocks(newListStocks);
		unsubscribeStock(stock.stock.symbol);
	};

	useEffect(() => {
		const getStocks = async () => {
			const stockSaved = getStocksSavedInLocalStorage();
			const stocks = (await getStockSymbols()).filter(
				(stock) => !stockSaved.find((s) => s.stock.symbol === stock.symbol)
			);
			setStocks(stocks);
			localStorage.setItem('stocks', JSON.stringify(stocks));
		};
		getStocks();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<stockContext.Provider
			value={{
				stocks,
				stockHistory: stockHistory,
				addStockHistory: updateHistoricalStock,
				removeStock,
			}}
		>
			{children}
		</stockContext.Provider>
	);
};

export default StockProvider;

export const useStockContext = () => useContext(stockContext);
