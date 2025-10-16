import React, {
	createContext,
	ReactElement,
	useContext,
	useEffect,
	useState,
} from 'react';
import { IStock } from '../types/Stock';
import useStockSocket from '../hook/useStockSocket';

export type StockPricePoint = {
	timestamp: number;
	price: number;
};

export type StockHistory = {
	stock: IStock;
	alertPrice: number;
	prices: StockPricePoint[];
};

type StockContext = {
	stocks: IStock[];
	stockHistory: StockHistory[];
	stockPrices: Record<string, number>;
};

type StockActionContext = {
	addStockHistory: (stock: IStock, alertPrice: number) => void;
};

type StockFullContext = StockContext & StockActionContext;

const defaultState: StockFullContext = {
	stocks: [],
	stockHistory: [],
	stockPrices: {},
	addStockHistory: () => {},
};

const stockContext = createContext<StockFullContext>(defaultState);

type Props = {
	children: ReactElement | ReactElement[];
};

const url = `https://finnhub.io/api/v1/stock/symbol?exchange=US&token=${process.env.NEXT_PUBLIC_FINNHUB_API_KEY}`;

const fetchStocks = async (): Promise<IStock[]> => {
	const response = await fetch(url);
	const data = await response.json();
	return data;
};

const initialStocks: IStock[] = [
	{
		symbol: 'BINANCE:BTCUSDT',
		currency: 'USD',
		description: 'Bitcoin US Dollar',
		displaySymbol: 'BTCUSDT',
		type: 'crypto',
		mic: 'BINANCE',
		figi: 'BBG001S5N8V8',
		shareClassFIGI: '',
		isin: null,
		symbol2: 'BTCUSDT',
	},
	{
		symbol: 'IC MARKETS:1',
		currency: 'USD',
		description: 'S&P 500',
		displaySymbol: 'SPX500',
		type: 'index',
		mic: 'IC MARKETS',
		figi: 'BBG001S5N8V8',
		shareClassFIGI: '',
		isin: null,
		symbol2: 'SPX500',
	},
];

const StockProvider = ({ children }: Props) => {
	const [stocks, setStocks] = useState<IStock[]>([]);
	const [historicalStocks, setHistoricalStocks] = useState<StockHistory[]>([]);
	const [stockPrices, stockHistory, subscribeNewStock] =
		useStockSocket(historicalStocks);

	const updateHistoricalStock = (stock: IStock, alertPrice: number) => {
		const newStock: StockHistory = {
			stock,
			alertPrice,
			prices: [],
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
			const stocksFromApi = await fetchStocks();
			const stocks = [...initialStocks, ...stocksFromApi.slice(0, 100)];
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
