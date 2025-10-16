import { useStockContext } from '@/app/Store/StockProvider';
import { StockHistory } from '@/app/types/StockProvider';
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
import { ChartWrapper, Container } from './index.styled';

function mergeHistory(history: StockHistory[]) {
	const merged: {
		[x: string]: number | null;
	}[] = [];
	const symbols = history.map((h) => h.stock.symbol);
	const allTimestamps = new Set<number>();

	history.forEach((h) => {
		const last30Prices = h.prices.filter((_, i) => i >= h.prices.length - 30);
		last30Prices.forEach((p) => allTimestamps.add(p.timestamp));
	});

	const sortedTimestamps = Array.from(allTimestamps).sort((a, b) => a - b);

	const lastValues: Record<string, number> = {};
	sortedTimestamps.forEach((ts) => {
		const point: { [key in string]: number | null } = { time: ts };
		symbols.forEach((sym) => {
			const pricePoint = history
				.find((h) => h.stock.symbol === sym)
				?.prices.find((p) => p.timestamp === ts);
			if (pricePoint) lastValues[sym] = pricePoint.price;
			point[sym] = lastValues[sym] ?? null;
		});
		merged.push(point);
	});

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
		<Container>
			<ChartWrapper>
				<ResponsiveContainer>
					<LineChart data={mergedData}>
						<CartesianGrid stroke='#ccc' strokeDasharray='5 5' />
						<XAxis
							dataKey='time'
							domain={['auto', 'auto']}
							tickFormatter={(t) => new Date(t).toLocaleTimeString()}
						/>
						<YAxis
							domain={[
								(dataMin: number) => dataMin * 0.999,
								(dataMax: number) => dataMax * 1.001,
							]}
							tickFormatter={(value) => value.toFixed(2)}
						/>
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
			</ChartWrapper>
		</Container>
	);
};

export default GraphStocks;
