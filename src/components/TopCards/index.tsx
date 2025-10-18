import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { TopCardSection } from './index.styled';
import Card from '../Card';
import 'swiper/css';
import { useStockContext } from '@/Store/StockProvider';
import { Button } from '@mui/material';

const TopCards = () => {
	// this help to handle the websocket connection, since the finnhub free plan only allows 1 connection per account
	const { stockHistory, isEnabledSocket, toggleSocketConnection } =
		useStockContext();
	return (
		<TopCardSection>
			<div className='flex gap-2 mb-2'>
				<h3 className='text-2xl font-semibold text-gray-600'>Overview</h3>
				<Button
					variant='contained'
					size='small'
					onClick={toggleSocketConnection}
					style={{
						background: isEnabledSocket ? '#E6000A' : '#1976d2',
					}}
				>
					{isEnabledSocket ? 'Disable' : 'Enable'} Live Updates
				</Button>
			</div>
			<Swiper
				spaceBetween={50}
				slidesPerView={1}
				breakpoints={{
					768: { slidesPerView: 2 },
					1024: { slidesPerView: 3 },
				}}
				grabCursor={true}
				loop={true}
				autoplay={true}
			>
				{stockHistory.map((sh, index) => (
					<SwiperSlide key={sh.stock.symbol}>
						<Card stockHistory={sh} index={index} />
					</SwiperSlide>
				))}
			</Swiper>
		</TopCardSection>
	);
};

export default TopCards;
