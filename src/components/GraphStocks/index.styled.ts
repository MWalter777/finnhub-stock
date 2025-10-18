import styled from 'styled-components';

export const Container = styled.section`
	width: 95%;
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
		width: 90%;
	}
`;

export const ChartWrapper = styled.div`
	width: 100%;
	height: 300px;
	background-color: #ffffff;
	border: 1px solid #e0e0e0;
	border-radius: 8px;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	padding: 1rem;
	display: flex;
	flex-direction: column;
	align-items: center;
`;
