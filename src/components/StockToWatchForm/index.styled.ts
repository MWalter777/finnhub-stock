import styled from 'styled-components';

export const FormSection = styled.form`
	width: 100%;
	padding: 1rem;
	display: flex;
	flex-direction: column;
	gap: 1rem;
	background-color: #f9f9f9;
	border-radius: 8px;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	width: 90%;
	margin: 1rem auto;
	div.MuiAutocomplete-root {
		width: 100%;
	}
	@media (min-width: 768px) {
		width: 33.3333%;
		margin: 0;
	}
	@media (min-width: 1024px) {
		width: 25%;
		margin: 0;
	}
`;
