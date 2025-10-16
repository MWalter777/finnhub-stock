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
};

type StockFullContext = StockContext & StockActionContext;

const defaultState: StockFullContext = {
	stocks: [],
	stockHistory: [],
	stockPrices: {},
	addStockHistory: async () => {},
};

const stockContext = createContext<StockFullContext>(defaultState);

type Props = {
	children: ReactElement | ReactElement[];
};

const StockProvider = ({ children }: Props) => {
	const [stocks, setStocks] = useState<IStock[]>([]);
	const [historicalStocks, setHistoricalStocks] = useState<StockHistory[]>([]);
	const [stockPrices, stockHistory, subscribeNewStock] =
		useStockSocket(historicalStocks);

	const updateHistoricalStock = async (stock: IStock, alertPrice: number) => {
		const initialData = await getInitialValueBySymbol(stock.symbol);
		console.log({ initialData });
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
		setHistoricalStocks((prev) => [...prev, newStock]);
		subscribeNewStock(newStock);
	};

	useEffect(() => {
		const getStocks = async () => {
			const stocksFromLocalStorage = localStorage.getItem('stocks');
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
			}}
		>
			{children}
		</stockContext.Provider>
	);
};

export default StockProvider;

export const useStockContext = () => useContext(stockContext);
