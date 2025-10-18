import React from 'react';
import { H2 } from './index.styled';
import { ArrowDownwardSharp, ArrowUpwardSharp } from '@mui/icons-material';

type Props = {
	priceData: {
		price: number;
		prevPrice: number;
	};
};

const BodyCard = ({ priceData }: Props) => {
	const isDownward = priceData.price < priceData.prevPrice;
	const symbol = isDownward ? '-' : '';
	console.log({ symbol });
	const difference = Math.abs(priceData.price - priceData.prevPrice);
	const percentageChange =
		(priceData.prevPrice
			? (difference / priceData.prevPrice) * 100
			: 0
		).toFixed(4) + '%';
	return (
		<div className='flex gap-4 justify-between items-center'>
			<H2 isdownward={isDownward ? 1 : 0}>
				{isDownward ? <ArrowDownwardSharp /> : <ArrowUpwardSharp />}
				<span>{percentageChange}</span>
			</H2>
			<span>
				({symbol} {difference.toFixed(4)})
			</span>
		</div>
	);
};

export default BodyCard;
