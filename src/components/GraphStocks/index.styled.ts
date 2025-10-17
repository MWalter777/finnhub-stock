import styled from 'styled-components';

export const Container = styled.section`
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 3rem;
	padding: 1rem;
	@media (min-width: 1280px) {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 2rem;
		padding: 2rem;
	}
`;

export const ChartWrapper = styled.div`
	width: 100%;
	height: 300px;
`;
