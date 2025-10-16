import { StockHistory, useStockContext } from '@/app/Store/StockProvider';
import React from 'react';
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	CartesianGrid,
} from 'recharts';

const TEN_SECONDS = 30000;

function mergeHistory2(history: StockHistory[]) {
	const now = Date.now();
	const merged: any[] = [];
	const symbols = history.map((h) => h.stock.symbol);
	const allTimestamps = new Set<number>();

	history.forEach((h) =>
		h.prices.forEach((p) => allTimestamps.add(p.timestamp))
	);

	const sortedTimestamps = Array.from(allTimestamps).sort((a, b) => a - b);

	let lastValues: Record<string, number> = {};
	sortedTimestamps.forEach((ts) => {
		const point: any = { time: ts };
		symbols.forEach((sym) => {
			const pricePoint = history
				.find((h) => h.stock.symbol === sym)
				?.prices.find((p) => p.timestamp === ts);
			if (pricePoint) lastValues[sym] = pricePoint.price;
			point[sym] = lastValues[sym] ?? null;
		});
		merged.push(point);
	});

	const dataToShow = merged.filter((point) => point.time >= now - TEN_SECONDS);
	return dataToShow;
}

function mergeHistory(history: StockHistory[]) {
	const merged: any[] = [];
	if (!history.length) return merged;

	const maxLength = Math.max(...history.map((h) => h.prices.length));

	for (let i = 0; i < maxLength; i++) {
		const point: any = { time: history[0].prices[i]?.timestamp || Date.now() };
		history.forEach((h) => {
			point[h.stock.symbol] = h.prices[i]?.price ?? null;
		});
		merged.push(point);
	}

	return merged;
}

function getColor(i: number) {
	const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088FE'];
	return colors[i % colors.length];
}

const GraphStocks = () => {
	const { stockHistory } = useStockContext();
	const mergedData = mergeHistory2(stockHistory);
	return (
		<section className=' w-full'>
			<div style={{ width: '100%', height: 300 }}>
				<ResponsiveContainer>
					<LineChart data={mergedData}>
						<CartesianGrid stroke='#ccc' strokeDasharray='5 5' />
						<XAxis
							dataKey='time'
							domain={['auto', 'auto']}
							tickFormatter={(t) => new Date(t).toLocaleTimeString()}
						/>
						<YAxis />
						<Tooltip labelFormatter={(t) => new Date(t).toLocaleTimeString()} />
						{stockHistory.map((sh, i) => {
							return (
								<Line
									key={sh.stock.symbol}
									dataKey={sh.stock.symbol}
									type='monotone'
									stroke={getColor(i)}
									strokeWidth={2}
									dot={false}
									isAnimationActive={false}
								/>
							);
						})}
					</LineChart>
				</ResponsiveContainer>
			</div>
		</section>
	);
};

export default GraphStocks;
