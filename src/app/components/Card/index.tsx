import { ArrowDownwardSharp, ArrowUpwardSharp } from '@mui/icons-material';
import React from 'react';
import { CardContainer, CardHeader, H2 } from './index.styled';
import { StockHistory, useStockContext } from '@/app/Store/StockProvider';

type Props = {
	stockHistory: StockHistory;
};

const Card = ({ stockHistory }: Props) => {
	const { stockPrices } = useStockContext();
	const priceData = stockPrices[stockHistory.stock.symbol] || {
		price: 0,
		prevPrice: 0,
	};
	const isDownward = priceData.price < priceData.prevPrice;
	const symbol = isDownward ? '-' : '+';
	const difference = Math.abs(priceData.price - priceData.prevPrice);
	const percentageChange =
		symbol +
		(priceData.prevPrice
			? (difference / priceData.prevPrice) * 100
			: 0
		).toFixed(8) +
		'%';
	const isValueBelowAlert = priceData.prevPrice < stockHistory.alertPrice;
	console.log({ priceData, stockHistory });
	return (
		<CardContainer
			style={{
				border: isValueBelowAlert ? '2px solid red' : '2px solid green',
			}}
		>
			<CardHeader>
				<h2>{stockHistory.stock.symbol}</h2>
				<p>{stockPrices[stockHistory.stock.symbol]?.price || 0}</p>
			</CardHeader>
			<div className='flex gap-4'>
				<H2 isdownward={isDownward ? 1 : 0}>
					{isDownward ? <ArrowDownwardSharp /> : <ArrowUpwardSharp />}
					<span>{percentageChange}</span>
				</H2>
				<span>
					({symbol} {difference.toFixed(8)})
				</span>
			</div>
		</CardContainer>
	);
};

export default Card;
