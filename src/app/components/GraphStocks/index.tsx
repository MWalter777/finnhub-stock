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
	const mergedData = mergeHistory(stockHistory);
	return (
		<section className=' w-full'>
			<div style={{ width: '100%', height: 300 }}>
				<ResponsiveContainer>
					<LineChart data={mergedData}>
						<CartesianGrid stroke='#ccc' strokeDasharray='5 5' />
						<XAxis
							dataKey='time'
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
									dot={true}
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
