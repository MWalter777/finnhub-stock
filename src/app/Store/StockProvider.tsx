import React, {
	createContext,
	ReactElement,
	useCallback,
	useEffect,
	useState,
} from 'react';
import { IStock } from '../types/Stock';

type StockContext = {
	stocks: IStock[];
	stockSelected: IStock | null;
};

type StockActionContext = {
	setStockSelected: (stock: IStock | null) => void;
};

type StockFullContext = StockContext & StockActionContext;

const defaultState: StockFullContext = {
	stocks: [],
	stockSelected: null,
	setStockSelected: () => {},
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
	const [stockSelected, setStockSelected] = useState<IStock | null>(null);

	const updateSelectedStock = useCallback((stock: IStock | null) => {
		setStockSelected(stock);
	}, []);

	useEffect(() => {
		const getStocks = async () => {
			const stocksFromLocalStorage = localStorage.getItem('stocks');
			if (stocksFromLocalStorage) {
				const currentStocks = JSON.parse(stocksFromLocalStorage) as IStock[];
				setStocks(currentStocks);
				updateSelectedStock(currentStocks[0]);
				console.log(JSON.parse(stocksFromLocalStorage));
				return;
			}
			const stocksFromApi = await fetchStocks();
			const stocks = stocksFromApi.slice(0, 100);
			setStocks(stocks);
			updateSelectedStock(stocks[0]);
			localStorage.setItem('stocks', JSON.stringify(stocks));
		};
		getStocks();
	}, []);

	return (
		<stockContext.Provider
			value={{
				stocks,
				stockSelected,
				setStockSelected: updateSelectedStock,
			}}
		>
			{children}
		</stockContext.Provider>
	);
};

export default StockProvider;

export const useStockContext = () => React.useContext(stockContext);
