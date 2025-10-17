import { useStockContext } from '@/Store/StockProvider';
import { StockHistory } from '@/types/StockProvider';
import React, { useEffect, useRef, useState } from 'react';
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	CartesianGrid,
	Area,
	AreaChart,
} from 'recharts';
import { ChartWrapper, Container } from './index.styled';
import { getColor } from '@/utils/colors';

function mergeHistory(history: StockHistory) {
	const merged: {
		[x: string]: number | null;
	}[] = [];
	if (!history) return merged;
	const symbols = history.stock.symbol;
	const allTimestamps = new Set<number>();
	const last30Prices = history.prices.filter(
		(_, i) => i >= history.prices.length - 30
	);
	last30Prices.forEach((p) => allTimestamps.add(p.timestamp));

	const sortedTimestamps = Array.from(allTimestamps).sort((a, b) => a - b);

	const lastValues: Record<string, number> = {};
	sortedTimestamps.forEach((ts) => {
		const point: { [key in string]: number | null } = { time: ts };
		const pricePoint = history?.prices.find((p) => p.timestamp === ts);
		if (pricePoint) lastValues[symbols] = pricePoint.price;
		point[symbols] = lastValues[symbols] ?? null;
		merged.push(point);
	});

	return merged;
}

const GraphStocks = () => {
	const { stockHistory } = useStockContext();
	return (
		<Container>
			{stockHistory.map((sh, i) => {
				const mergedData = mergeHistory(sh);
				return (
					<ChartWrapper key={sh.stock.symbol}>
						<span
							className='flex justify-center'
							style={{ color: getColor(i), fontWeight: 'bold' }}
						>
							{sh.stock.symbol}
						</span>
						<ResponsiveContainer>
							<AreaChart data={mergedData}>
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
								<Tooltip
									labelFormatter={(t) => new Date(t).toLocaleTimeString()}
								/>
								{stockHistory.map((sh, i) => {
									return (
										<Area
											key={sh.stock.symbol}
											dataKey={sh.stock.symbol}
											type='monotone'
											stroke={getColor(i)}
											strokeWidth={2}
											fill={getColor(i)}
											fillOpacity={0.3}
											dot={false}
											isAnimationActive={false}
										/>
									);
								})}
							</AreaChart>
						</ResponsiveContainer>
					</ChartWrapper>
				);
			})}
		</Container>
	);
};

export default GraphStocks;
