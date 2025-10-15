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

const data = [
	{ date: 'Oct 1', value: 1234 },
	{ date: 'Oct 2', value: 1450 },
	{ date: 'Oct 3', value: 1320 },
	{ date: 'Oct 4', value: 1600 },
	{ date: 'Oct 5', value: 1580 },
];

const GraphStocks = () => {
	return (
		<section className=' w-full'>
			<div style={{ width: '100%', height: 300 }}>
				<ResponsiveContainer>
					<LineChart data={data}>
						<CartesianGrid strokeDasharray='3 3' />
						<XAxis dataKey='date' />
						<YAxis />
						<Tooltip />
						<Line
							type='monotone'
							dataKey='value'
							stroke='#0070f3'
							strokeWidth={2}
							dot={true}
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		</section>
	);
};

export default GraphStocks;
