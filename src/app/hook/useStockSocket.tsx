import { useEffect, useState } from 'react';
import { StreamStockPrice } from '../types/Stock';
import { PriceRecord } from '../types/StockSocket';
import { StockHistory, StockPricePoint } from '../types/StockProvider';

const API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
const SOCKET_URL = `wss://ws.finnhub.io?token=${API_KEY}`;

export default function useStockSocket(
	stockList: StockHistory[]
): [
	PriceRecord,
	StockHistory[],
	(history: StockHistory) => void,
	(symbol: string) => void,
	() => void
] {
	const [prices, setPrices] = useState<PriceRecord>({});
	const [history, setHistory] = useState<StockHistory[]>([]);

	const saveInLocalStorage = (data: StockHistory[]) => {
		console.log('Saving stock history to localStorage:', data);
		if (typeof window !== 'undefined' && data.length > 0) {
			localStorage.setItem('stockHistory', JSON.stringify(data));
		}
	};

	const loadFromLocalStorage = () => {
		if (typeof window !== 'undefined') {
			const storedData = localStorage.getItem('stockHistory');
			if (storedData) {
				try {
					const parsedData = JSON.parse(storedData) as StockHistory[];
					setHistory(parsedData);
					const initialPrices: PriceRecord = {};
					parsedData.forEach((h) => {
						if (h.prices.length > 0) {
							const lastPricePoint = h.prices[h.prices.length - 1];
							initialPrices[h.stock.symbol] = {
								price: lastPricePoint.price,
								prevPrice: lastPricePoint.prevPrice,
							};
						}
					});
					setPrices(initialPrices);
				} catch (error) {
					console.error(
						'Error parsing stock history from localStorage:',
						error
					);
				}
			}
		}
	};

	useEffect(() => {
		const socket = new WebSocket(SOCKET_URL);

		socket.onopen = () => {
			console.log('WebSocket connected');
			stockList.forEach((h) => {
				socket.send(
					JSON.stringify({ type: 'subscribe', symbol: h.stock.symbol })
				);
			});
		};

		socket.onmessage = (event) => {
			const data = JSON.parse(event.data) as {
				type: string;
				data: StreamStockPrice[];
			};
			if (data.type === 'trade' && data.data && Array.isArray(data.data)) {
				const latestPrices: PriceRecord = {};
				data.data.forEach((trade: StreamStockPrice) => {
					const prevPrice = prices[trade.s]?.price ?? trade.p;
					latestPrices[trade.s] = {
						price: trade.p,
						prevPrice: prevPrice,
					};
					setHistory((prevHist: StockHistory[]) => {
						const stockHist: StockHistory | undefined = prevHist.find(
							(h) => h.stock.symbol === trade.s
						);
						const pricePoint: StockPricePoint = {
							timestamp: trade.t,
							price: trade.p,
							prevPrice: prevPrice,
						};
						if (stockHist) {
							stockHist.prices.push(pricePoint);
						}
						return [...prevHist];
					});
				});
				setPrices((prev) => ({
					...prev,
					...latestPrices,
				}));
			}
		};

		return () => {
			saveInLocalStorage(history);
			socket.close();
			console.log('WebSocket disconnected');
		};
	}, [stockList]);

	const subscribeNewStock = (historicalStock: StockHistory) => {
		setHistory((prev) => [...prev, historicalStock]);
		const currentPrice =
			historicalStock.prices.length > 0
				? historicalStock.prices[historicalStock.prices.length - 1].price
				: 0;
		setPrices((prev) => ({
			...prev,
			[historicalStock.stock.symbol]: {
				price: currentPrice,
				prevPrice: currentPrice,
			},
		}));
	};

	const unsubscribeStock = (symbol: string) => {
		setHistory((prev) => prev.filter((h) => h.stock.symbol !== symbol));
		setPrices((prev) => {
			const updatedPrices = { ...prev };
			delete updatedPrices[symbol];
			return updatedPrices;
		});
	};

	return [
		prices,
		history,
		subscribeNewStock,
		unsubscribeStock,
		loadFromLocalStorage,
	];
}
