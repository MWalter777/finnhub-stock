import React from 'react';
import { CardContainer, CardHeader } from './index.styled';
import { useStockContext } from '@/Store/StockProvider';
import { StockHistory } from '@/types/StockProvider';
import CloseIcon from '@mui/icons-material/Close';
import BodyCard from './BodyCard';
import { getColor } from '@/utils/graphUtils';

type Props = {
	stockHistory: StockHistory;
	index: number;
};

const getPrices = (stockHistory?: StockHistory) => {
	if (stockHistory?.prices?.length) {
		const currentPrice = stockHistory.prices[stockHistory.prices.length - 1];
		if (stockHistory.prices.length > 1) {
			const previousPrice = stockHistory.prices[stockHistory.prices.length - 2];
			return {
				price: currentPrice.price,
				prevPrice: previousPrice.price,
			};
		}
		return {
			price: currentPrice.price,
			prevPrice: currentPrice.price,
		};
	}
	return {
		price: 0,
		prevPrice: 0,
	};
};

const Card = ({ stockHistory, index }: Props) => {
	const { removeStock } = useStockContext();
	const priceData = getPrices(stockHistory);
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
				<h2
					style={{
						color: getColor(index),
					}}
				>
					{stockHistory.stock.symbol}
				</h2>
				<p>$ {priceData.price}</p>
			</CardHeader>
			<BodyCard priceData={priceData} />
		</CardContainer>
	);
};

export default Card;
