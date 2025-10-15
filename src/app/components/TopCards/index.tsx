import React from 'react';
import { TopCardSection } from './index.styled';
import Card from '../Card';

const cards = new Array(8).fill(0);

const TopCards = () => {
	return (
		<TopCardSection>
			{cards.map((_, index) => (
				<Card key={index} />
			))}
		</TopCardSection>
	);
};

export default TopCards;
