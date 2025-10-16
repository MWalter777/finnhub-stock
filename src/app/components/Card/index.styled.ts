import styled from 'styled-components';

export const CardContainer = styled.div`
	width: 100%;
	max-width: 400px;
	background-color: #ffffff;
	border-radius: 8px;
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	padding: 16px;
	margin: 16px auto;
	display: flex;
	flex-direction: column;
	gap: 12px;
	position: relative;
`;
export const CardHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

interface H2Props {
	isdownward?: string | number | boolean;
}

export const H2 = styled.h2<H2Props>`
	font-size: 1.5rem;
	font-weight: 600;
	color: #333333;
	margin: 0;
	color: ${(props) => (props.isdownward ? 'red' : 'green')};
`;
