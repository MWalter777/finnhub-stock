import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { TopCardSection } from './index.styled';
import Card from '../Card';
import 'swiper/css';
import { useStockContext } from '@/app/Store/StockProvider';

const TopCards = () => {
	const { stockHistory } = useStockContext();
	return (
		<TopCardSection>
			<Swiper
				spaceBetween={50}
				slidesPerView={1}
				breakpoints={{
					768: { slidesPerView: 2 },
					1024: { slidesPerView: 3 },
				}}
				grabCursor={true}
				loop={true}
			>
				{stockHistory.map((sh, index) => (
					<SwiperSlide key={index}>
						<Card stockHistory={sh} />
					</SwiperSlide>
				))}
			</Swiper>
		</TopCardSection>
	);
};

export default TopCards;
