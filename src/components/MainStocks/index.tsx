import React from 'react';
import StockToWatchForm from '../StockToWatchForm';
import TopCards from '../TopCards';
import GraphStocks from '../GraphStocks';
import { MainContainer, StockSection } from './index.styled';

const MainStocks = () => {
	return (
		<MainContainer className='w-full flex flex-col gap-4'>
			<StockSection>
				<StockToWatchForm />
				<TopCards />
			</StockSection>
			<GraphStocks />
			<section></section>
		</MainContainer>
	);
};

export default MainStocks;
