import { StockHistory } from '@/types/StockProvider';
import React from 'react';
import { getColor, mergeAllDataHistory } from '@/utils/graphUtils';
import {
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

type Props = {
	stockHistory: StockHistory[];
};

const SingleGraph = ({ stockHistory }: Props) => {
	const mergedData = mergeAllDataHistory(stockHistory);
	return (
		<div className='flex gap-3 w-full justify-center flex-col items-center'>
			<div className='w-10/12 flex h-96'>
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
			</div>
		</div>
	);
};

export default SingleGraph;
