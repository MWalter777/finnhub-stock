import { useEffect, useRef, useState } from 'react';
import { IStock, StreamStockPrice } from '../types/Stock';
import { StockHistory, StockPricePoint } from '../Store/StockProvider';

const API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
const SOCKET_URL = `wss://ws.finnhub.io?token=${API_KEY}`;

export default function useStockSocket(
	stockList: StockHistory[]
): [Record<string, number>, StockHistory[], (history: StockHistory) => void] {
	const [prices, setPrices] = useState<Record<string, number>>({});
	const prevPrices = useRef<Record<string, number>>({});
	const [history, setHistory] = useState<StockHistory[]>([]);

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
				const latestPrices: Record<string, number> = {};
				data.data.forEach((trade: StreamStockPrice) => {
					const prevPrice = prevPrices.current[trade.s] ?? trade.p;
					latestPrices[`${trade.s}-prev`] = prevPrice;
					latestPrices[trade.s] = trade.p;
					prevPrices.current[trade.s] = trade.p;
					setHistory((prevHist: any[]) => {
						const stockHist: StockHistory = prevHist.find(
							(h) => h.stock.symbol === trade.s
						) as any;
						const pricePoint: StockPricePoint = {
							timestamp: trade.t,
							price: trade.p,
							prevPrice: prevPrice,
						};
						if (stockHist) {
							stockHist.prices.push(pricePoint);
							return [...prevHist];
						} else {
							return [
								...prevHist,
								{
									stock: { symbol: trade.s, alertPrice: 0 },
									prices: [pricePoint],
									alertPrice: 0,
								},
							];
						}
					});
				});
				setPrices((prev) => ({
					...prev,
					...latestPrices,
				}));
			}
		};

		return () => socket.close();
	}, [stockList]);

	const subscribeNewStock = (historicalStock: StockHistory) => {
		setHistory((prev) => [...prev, historicalStock]);
		const currentPrice =
			historicalStock.prices.length > 0
				? historicalStock.prices[historicalStock.prices.length - 1].price
				: 0;
		setPrices((prev) => ({
			...prev,
			[historicalStock.stock.symbol]: currentPrice,
		}));
		console.log('new subscription', historicalStock);
	};

	return [prices, history, subscribeNewStock];
}
