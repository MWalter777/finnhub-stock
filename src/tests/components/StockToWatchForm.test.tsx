import StockToWatchForm from '@/components/StockToWatchForm';

import { act, fireEvent, render, screen } from '@testing-library/react';

// Mock the useStockContext hook
jest.mock('@/Store/StockProvider', () => ({
	useStockContext: jest.fn().mockReturnValue({
		stocks: [
			{ symbol: 'AAPL', name: 'Apple Inc.' },
			{ symbol: 'GOOGL', name: 'Alphabet Inc.' },
		],
		stockHistory: [
			{ stock: { symbol: 'AAPL', name: 'Apple Inc.' }, alertPrice: 150 },
		],
		addStockHistory: jest.fn(),
	}),
}));

describe('StockToWatchForm', () => {
	it('StockToWatchForm filling the form', async () => {
		render(<StockToWatchForm />);
		const stockAutocomplete = await screen.findByTestId('stock-autocomplete');
		expect(stockAutocomplete).toBeInTheDocument();
		const button = stockAutocomplete.querySelector('button');
		expect(button).toBeInTheDocument();
		fireEvent.click(button!);
		fireEvent.click(screen.getByText('AAPL'));
		expect(stockAutocomplete.querySelector('input')).toHaveValue('AAPL');

		await act(async () => {
			//set 200 in the alertPrice input
			const text = await screen.findByTestId('alertPrice');
			expect(text).toBeInTheDocument();
			const input = text.querySelector('input');
			expect(input).toBeInTheDocument();
			fireEvent.change(input!, { target: { value: '200' } });
			expect((input as HTMLInputElement).value).toBe('200');
			const addButton = await screen.findByTestId('add-stock-button');
			fireEvent.click(addButton);
			expect(addButton).toBeInTheDocument();
		});
	});
});
