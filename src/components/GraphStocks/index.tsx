import { useStockContext } from '@/Store/StockProvider';
import React from 'react';
import MultiGraphs from './MultiGraphs';

const GraphStocks = () => {
	const { stockHistory } = useStockContext();
	return <MultiGraphs stockHistory={stockHistory} />;
};

export default GraphStocks;
