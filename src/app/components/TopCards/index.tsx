'use client';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { TopCardSection } from './index.styled';
import Card from '../Card';
import 'swiper/css';

const cards = new Array(8).fill(0);

const TopCards = () => {
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
				{cards.map((_, index) => (
					<SwiperSlide key={index}>
						<Card />
					</SwiperSlide>
				))}
			</Swiper>
		</TopCardSection>
	);
};

export default TopCards;
