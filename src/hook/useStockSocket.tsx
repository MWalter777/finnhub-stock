import { useEffect, useRef, useState } from 'react';
import { StreamStockPrice } from '../types/Stock';
import { PriceRecord } from '../types/StockSocket';
import { StockHistory, StockPricePoint } from '../types/StockProvider';
import { useOnlineStatus } from './useOnlineStatus';
import { UseStockSocketReturn } from '@/types/UseStockSocket';
import {
	getStocksSavedInLocalStorage,
	saveLastestHistoricalData,
} from '@/utils/localStorageHandle';
import useShowNotification from './useShowNotification';

const API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
const SOCKET_URL = `wss://ws.finnhub.io?token=${API_KEY}`;

/**
 * Custom hook to manage WebSocket connection for real-time stock price updates.
 * It handles subscribing and unsubscribing to stock symbols, maintaining
 * historical price data, and reacting to online/offline status changes.
 * @returns An object containing the stock price history and functions to
 * subscribe/unsubscribe to stock symbols.
 */
export default function useStockSocket(): UseStockSocketReturn {
	const { isOnline } = useOnlineStatus();
	const [history, setHistory] = useState<StockHistory[]>([]);
	const historicalRef = useRef<StockHistory[]>([]);
	const subscribedSymbolsRef = useRef<Set<string>>(new Set());
	const socketRef = useRef<WebSocket | null>(null);
	// push notification
	const { sendCustomNotification } = useShowNotification();

	useEffect(() => {
		if (!isOnline) {
			if (socketRef.current) {
				socketRef.current.close();
				socketRef.current = null;
			}
		} else {
			if (!socketRef.current) {
				socketRef.current = new WebSocket(SOCKET_URL);
				socketRef.current.onopen = () => {
					const storedData = getStocksSavedInLocalStorage();
					storedData.forEach((h) => {
						subscribedSymbolsRef.current.add(h.stock.symbol);
						socketRef.current?.send(
							JSON.stringify({
								type: 'subscribe',
								symbol: h.stock.symbol,
							})
						);
					});
				};

				socketRef.current.onmessage = (event) => {
					const data = JSON.parse(event.data) as {
						type: string;
						data: StreamStockPrice[];
					};
					if (data.type === 'trade' && data.data && Array.isArray(data.data)) {
						const streamFirstData: StreamStockPrice = data.data[0];
						if (streamFirstData && streamFirstData.s) {
							const currentHistoricalData = historicalRef.current.map((h) => {
								if (h.stock.symbol == streamFirstData.s) {
									const prices = h.prices;
									const lastPrice = h.prices?.length
										? h.prices[h.prices.length - 1].price
										: streamFirstData.p;
									const newPrice: StockPricePoint = {
										prevPrice: lastPrice,
										price: streamFirstData.p,
										timestamp: new Date().getTime(),
									};
									// send notification
									sendCustomNotification(h.stock.symbol, newPrice);
									const updatedHistory: StockHistory = {
										...h,
										prices: [...prices, newPrice],
									};
									return updatedHistory;
								}
								return h;
							});
							updateHistory(currentHistoricalData);
						}
					}
				};
			}
		}

		return () => {
			if (socketRef.current) {
				socketRef.current.close();
				socketRef.current = null;
			}
		};
	}, [isOnline]);

	useEffect(() => {
		const storedData = getStocksSavedInLocalStorage();

		if (storedData && storedData.length > 0) {
			historicalRef.current = storedData;
			setHistory(historicalRef.current);
			storedData.forEach((h) => {
				subscribeStockToSocket(h.stock.symbol);
			});
		}
	}, [isOnline]);

	const updateHistory = (updatedHistory: StockHistory[]) => {
		historicalRef.current = updatedHistory;
		setHistory(updatedHistory);
		saveLastestHistoricalData(updatedHistory);
	};

	const subscribeStockToSocket = (symbol: string) => {
		if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
			if (!subscribedSymbolsRef.current.has(symbol)) {
				subscribedSymbolsRef.current.add(symbol);
				socketRef.current.send(
					JSON.stringify({
						type: 'subscribe',
						symbol: symbol,
					})
				);
			}
		}
	};

	const unsubscribeStockSocket = (symbol: string) => {
		if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
			socketRef.current.send(JSON.stringify({ type: 'unsubscribe', symbol }));
		}
		subscribedSymbolsRef.current.delete(symbol);
	};

	const subscribeNewStock = (historicalStock: StockHistory) => {
		updateHistory([...historicalRef.current, historicalStock]);
		subscribeStockToSocket(historicalStock.stock.symbol);
	};

	const unsubscribeStock = (symbol: string) => {
		const updatedHistory = historicalRef.current.filter(
			(h) => h.stock.symbol !== symbol
		);
		updateHistory(updatedHistory);
		unsubscribeStockSocket(symbol);
	};

	return {
		history,
		subscribeNewStock,
		unsubscribeStock,
	};
}
