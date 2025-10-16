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

type StockContext = {
	stocks: IStock[];
	stockHistory: StockHistory[];
	stockPrices: PriceRecord;
};

type StockActionContext = {
	addStockHistory: (stock: IStock, alertPrice: number) => Promise<void>;
	removeStock: (symbol: string) => void;
};

type StockFullContext = StockContext & StockActionContext;

const defaultState: StockFullContext = {
	stocks: [],
	stockHistory: [],
	stockPrices: {},
	addStockHistory: async () => {},
	removeStock: () => {},
};

const stockContext = createContext<StockFullContext>(defaultState);

type Props = {
	children: ReactElement | ReactElement[];
};

const StockProvider = ({ children }: Props) => {
	const [stocks, setStocks] = useState<IStock[]>([]);
	const [
		stockPrices,
		stockHistory,
		subscribeNewStock,
		unsubscribeStock,
		loadFromLocalStorage,
	] = useStockSocket([]);

	const updateHistoricalStock = async (stock: IStock, alertPrice: number) => {
		const initialData = await getInitialValueBySymbol(stock.symbol);
		const prices: StockPricePoint[] = initialData?.c
			? [
					{
						timestamp: initialData.t,
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
		console.log('Removing stock:', symbol);
		const stock = stockHistory.find((s) => s.stock.symbol === symbol);
		console.log('Found stock to remove:', {
			stock,
			stockHistory,
		});
		if (!stock) return;
		const newListStocks: IStock[] = [stock.stock, ...stocks];
		setStocks(newListStocks);
		unsubscribeStock(stock.stock.symbol);
	};

	useEffect(() => {
		const getStocks = async () => {
			const stocksFromLocalStorage = localStorage.getItem('stocks');
			loadFromLocalStorage();
			if (stocksFromLocalStorage) {
				const currentStocks = JSON.parse(stocksFromLocalStorage) as IStock[];
				setStocks(currentStocks);
				return;
			}
			const stocks = await getStockSymbols();
			setStocks(stocks);
			localStorage.setItem('stocks', JSON.stringify(stocks));
		};
		getStocks();
	}, []);

	return (
		<stockContext.Provider
			value={{
				stocks,
				stockHistory: stockHistory,
				stockPrices,
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
