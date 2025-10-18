import { render, screen } from '@testing-library/react';
import TopCards from '@/components/TopCards';

// mock useStockContext
jest.mock('@/Store/StockProvider', () => ({
	useStockContext: jest.fn().mockReturnValue({
		stockHistory: [
			{ stock: { symbol: 'AAPL' }, history: [] },
			{ stock: { symbol: 'GOOGL' }, history: [] },
			{ stock: { symbol: 'MSFT' }, history: [] },
		],
	}),
}));

jest.mock('swiper/react', () => ({
	Swiper: ({ children }: any) => <div>{children}</div>,
	SwiperSlide: ({ children }: any) => <div>{children}</div>,
}));

// mock 'swiper/css'
jest.mock('swiper/css', () => {});

describe('TopCards', () => {
	it('render a list of text', async () => {
		render(<TopCards />);

		expect(screen.getByText('AAPL')).toBeInTheDocument();
	});
});
