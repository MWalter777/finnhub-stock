import { FINNHUB_URLS } from '../constant/finnhubUrls';
import { CurrentStockPrice, IStock } from '../types/Stock';

/**
 * @param url: endpoint to make a generic request
 * @returns: data from the endpoint
 */
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

/**
 *
 * @returns a list of stocks (from the endpoint or localstorage)
 */
export const getStockSymbols = async (): Promise<IStock[]> => {
	// verify if the data is in local storage
	const localData = localStorage.getItem('stockSymbols');
	if (localData) {
		return JSON.parse(localData) as IStock[];
	}

	const stocksFromApi = await fetchStocks<IStock[]>(FINNHUB_URLS.stockSymbols);
	// Filter principal stocks (to ensure they are included) and limit the total number of stocks stored
	const filteredStocks = stocksFromApi.filter(
		(stock) =>
			principalStocks.includes(stock.symbol2) ||
			principalStocks.includes(stock.symbol)
	);
	const stocks = [...filteredStocks, ...stocksFromApi.slice(0, 50)];
	// Store the data in local storage
	localStorage.setItem('stockSymbols', JSON.stringify(stocks));
	return stocks;
};

/**
 *
 * @param symbol: stock symbol to get the current price
 * @returns current stock price data
 */
export const getInitialValueBySymbol = async (
	symbol: string
): Promise<CurrentStockPrice> => {
	const currentStockPrice = await fetchStocks<CurrentStockPrice>(
		`${FINNHUB_URLS.stockQuote}?symbol=${symbol}`
	);
	return currentStockPrice;
};
