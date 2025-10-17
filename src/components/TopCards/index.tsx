import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { TopCardSection } from './index.styled';
import Card from '../Card';
import 'swiper/css';
import { useStockContext } from '@/Store/StockProvider';

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
					<SwiperSlide key={sh.stock.symbol}>
						<Card stockHistory={sh} index={index} />
					</SwiperSlide>
				))}
			</Swiper>
		</TopCardSection>
	);
};

export default TopCards;
