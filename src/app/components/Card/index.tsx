import { ArrowDownwardSharp } from '@mui/icons-material';
import React from 'react';
import { CardContainer, CardHeader } from './index.styled';

const Card = () => {
	return (
		<CardContainer>
			<CardHeader>
				<h2>BTC-USD</h2>
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
