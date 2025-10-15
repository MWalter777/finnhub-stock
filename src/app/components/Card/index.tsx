import { ArrowDownwardSharp } from '@mui/icons-material';
import React from 'react';
import { CardContainer, CardHeader } from './index.styled';
import { StockHistory } from '@/app/Store/StockProvider';

type Props = {
	stockHistory: StockHistory;
};

const Card = ({ stockHistory }: Props) => {
	return (
		<CardContainer>
			<CardHeader>
				<h2>{stockHistory.stock.symbol}</h2>
				<p>111132.85</p>
			</CardHeader>
			<div className='flex gap-4'>
				<h2 className='text-red-500'>
					<ArrowDownwardSharp />
					<span>+5.85%</span>
				</h2>
				<span>(+123)</span>
			</div>
		</CardContainer>
	);
};

export default Card;
