import { StockHistory } from '@/types/StockProvider';
import React from 'react';
import {
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	CartesianGrid,
	Area,
	AreaChart,
} from 'recharts';
import { ChartWrapper, Container } from './index.styled';
import { getColor, mergeHistory } from '@/utils/graphUtils';

type Props = {
	stockHistory: StockHistory[];
};

const MultiGraphs = ({ stockHistory }: Props) => {
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
									tickFormatter={() => ''}
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
							</AreaChart>
						</ResponsiveContainer>
					</ChartWrapper>
				);
			})}
		</Container>
	);
};

export default MultiGraphs;
