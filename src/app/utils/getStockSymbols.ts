import { FINNHUB_URLS } from '../constant/finnhubUrls';
import { CurrentStockPrice, IStock } from '../types/Stock';

const fetchStocks = async <T>(url: string): Promise<T> => {
	const response = await fetch(
		`${url}&token=${process.env.NEXT_PUBLIC_FINNHUB_API_KEY}`
	);
	const data = await response.json();
	return data;
};

const testStock: IStock[] = [
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
