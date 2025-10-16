import styled from 'styled-components';

export const MainContainer = styled.main`
	display: flex;
	flex-direction: column;
	gap: 1rem;
	width: 100%;
	align-items: center;
`;

export const StockSection = styled.section`
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 1rem;
	@media (min-width: 768px) {
		flex-direction: row;
		gap: 2rem;
	}
	@media (min-width: 1024px) {
		gap: 3rem;
		width: 85%;
	}
`;
