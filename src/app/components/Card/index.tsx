import React from 'react';
import { CardContainer, CardHeader } from './index.styled';
import { useStockContext } from '@/app/Store/StockProvider';
import { StockHistory } from '@/app/types/StockProvider';
import CloseIcon from '@mui/icons-material/Close';
import BodyCard from './BodyCard';

type Props = {
	stockHistory: StockHistory;
};

const Card = ({ stockHistory }: Props) => {
	const { stockPrices, removeStock } = useStockContext();
	const priceData = stockPrices[stockHistory.stock.symbol] || {
		price: 0,
		prevPrice: 0,
	};
	const isValueBelowAlert = priceData.prevPrice < stockHistory.alertPrice;
	return (
		<CardContainer
			style={{
				border: isValueBelowAlert ? '2px solid red' : '2px solid green',
			}}
		>
			<button
				onClick={() => removeStock(stockHistory.stock.symbol)}
				className='absolute right-2 top-0 hover:scale-110 transition-transform cursor-pointer'
			>
				<CloseIcon />
			</button>
			<CardHeader>
				<h2>{stockHistory.stock.symbol}</h2>
				<p>$ {priceData.price}</p>
			</CardHeader>
			<BodyCard priceData={priceData} />
		</CardContainer>
	);
};

export default Card;
