import { FINNHUB_URLS } from '../constant/finnhubUrls';
import { CurrentStockPrice, IStock } from '../types/Stock';

const fetchStocks = async <T>(url: string): Promise<T> => {
	const response = await fetch(
		`${url}&token=${process.env.NEXT_PUBLIC_FINNHUB_API_KEY}`
	);
	const data = await response.json();
	return data;
};

const principalStocks = [
	'MSFT',
	'AAPL',
	'GOOGL',
	'AMZN',
	'TSLA',
	'META',
	'NVDA',
	'GBP',
	'GBP/USD',
	'EUR/USD',
	'BTC-USD',
	'ETH-USD',
];

export const getStockSymbols = async (): Promise<IStock[]> => {
	const stocksFromApi = await fetchStocks<IStock[]>(FINNHUB_URLS.stockSymbols);
	// Filter principal stocks
	const filteredStocks = stocksFromApi.filter(
		(stock) =>
			principalStocks.includes(stock.symbol2) ||
			principalStocks.includes(stock.symbol)
	);
	const stocks = [...filteredStocks, ...stocksFromApi.slice(0, 50)];
	return stocks;
};

export const getInitialValueBySymbol = async (
	symbol: string
): Promise<CurrentStockPrice> => {
	const currentStockPrice = await fetchStocks<CurrentStockPrice>(
		`${FINNHUB_URLS.stockQuote}?symbol=${symbol}`
	);
	return currentStockPrice;
};
