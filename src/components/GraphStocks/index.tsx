import { useStockContext } from '@/Store/StockProvider';
import React from 'react';
import MultiGraphs from './MultiGraphs';
import SingleGraph from './SingleGraph';

const GraphStocks = () => {
	const { stockHistory } = useStockContext();
	return <SingleGraph stockHistory={stockHistory} />;
};

export default GraphStocks;
