import { render, screen } from '@testing-library/react';
import TopCards from '@/components/TopCards';

// mock useStockContext
jest.mock('@/Store/StockProvider', () => ({
	useStockContext: jest.fn().mockReturnValue({
		stockHistory: [
			{
				stock: {
					currency: 'USD',
					description: 'APPLE INC',
					displaySymbol: 'AAPL',
					figi: 'BBG000B9XRY4',
					isin: null,
					mic: 'XNAS',
					shareClassFIGI: 'BBG001S5N8V8',
					symbol: 'AAPL',
					symbol2: '',
					type: 'Common Stock',
				},
				alertPrice: 252,
				prices: [
					{
						timestamp: 6,
						price: 251.9701,
						prevPrice: 247.45,
					},
					{
						prevPrice: 251.9701,
						price: 252.19,
						timestamp: 5,
					},
					{
						prevPrice: 252.19,
						price: 252.19,
						timestamp: 4,
					},
					{
						prevPrice: 252.19,
						price: 252.21,
						timestamp: 3,
					},
					{
						prevPrice: 252.21,
						price: 252.11,
						timestamp: 2,
					},
					{
						prevPrice: 252.11,
						price: 252.09,
						timestamp: 1,
					},
					{
						prevPrice: 252.09,
						price: 252.1,
						timestamp: 0,
					},
				],
			},
			{
				stock: {
					currency: 'USD',
					description: 'AMAZON.COM INC',
					displaySymbol: 'AMZN',
					figi: 'BBG000BVPV84',
					isin: null,
					mic: 'XNAS',
					shareClassFIGI: 'BBG001S5PQL7',
					symbol: 'AMZN',
					symbol2: '',
					type: 'Common Stock',
				},
				alertPrice: 213,
				prices: [
					{
						timestamp: 6,
						price: 213.365,
						prevPrice: 214.47,
					},
				],
			},
			{
				stock: {
					currency: 'USD250',
					description: 'NC',
					displaySymbol: 'AMZNw2',
					figi: 'BBG000BVPVasd',
					isin: null,
					mic: 'XNAS',
					shareClassFIGI: 'BBG001S5PQL7',
					symbol: 'AMZNas',
					symbol2: '',
					type: 'Common Stock',
				},
				alertPrice: 213,
				prices: [],
			},

			{
				stock: {
					currency: 'USD25',
					description: 'NC',
					displaySymbol: 'AMZNw2',
					figi: 'BBG000BVPVasd',
					isin: null,
					mic: 'XNAS',
					shareClassFIGI: 'BBG001S5PQL7',
					symbol: 'ASDF',
					symbol2: '',
					type: 'Common Stock',
				},
				alertPrice: 213,
				prices: [
					{
						timestamp: 6,
						price: 150,
						prevPrice: 18.47,
					},
					{
						timestamp: 5,
						price: 15,
						prevPrice: 150,
					},
				],
			},
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
