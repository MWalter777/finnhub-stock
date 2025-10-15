import React, {
	createContext,
	ReactElement,
	useContext,
	useEffect,
	useState,
} from 'react';
import { IStock } from '../types/Stock';

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
};

type StockActionContext = {
	addStockHistory: (stock: IStock, alertPrice: number) => void;
};

type StockFullContext = StockContext & StockActionContext;

const defaultState: StockFullContext = {
	stocks: [],
	stockHistory: [],
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

const StockProvider = ({ children }: Props) => {
	const [stocks, setStocks] = useState<IStock[]>([]);
	const [historicalStocks, setHistoricalStocks] = useState<StockHistory[]>([]);

	const updateHistoricalStock = (stock: IStock, alertPrice: number) => {
		const newStock: StockHistory = {
			stock,
			alertPrice,
			prices: [
				{
					timestamp: new Date(Date.now() - 5000).getTime(),
					price: Math.random() * 1510,
				},
				{
					timestamp: new Date(Date.now() - 7000).getTime(),
					price: Math.random() * 1510,
				},
				{
					timestamp: new Date(Date.now() - 8000).getTime(),
					price: Math.random() * 1510,
				},
				{
					timestamp: new Date(Date.now() - 9000).getTime(),
					price: Math.random() * 1510,
				},
				{
					timestamp: new Date(Date.now() - 15000).getTime(),
					price: Math.random() * 1510,
				},
			],
		};
		console.log(newStock);
		setHistoricalStocks((prev) => [...prev, newStock]);
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
			const stocks = stocksFromApi.slice(0, 1000);
			setStocks(stocks);
			localStorage.setItem('stocks', JSON.stringify(stocks));
		};
		getStocks();
	}, []);

	return (
		<stockContext.Provider
			value={{
				stocks,
				stockHistory: historicalStocks,
				addStockHistory: updateHistoricalStock,
			}}
		>
			{children}
		</stockContext.Provider>
	);
};

export default StockProvider;

export const useStockContext = () => useContext(stockContext);
