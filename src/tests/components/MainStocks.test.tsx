import MainStocks from '@/components/MainStocks';

import { render, screen } from '@testing-library/react';

jest.mock('swiper/react', () => ({
	Swiper: ({ children }: any) => <div>{children}</div>,
	SwiperSlide: ({ children }: any) => <div>{children}</div>,
}));

// mock 'swiper/css'
jest.mock('swiper/css', () => {});

describe('MainStocks', () => {
	it('renders a heading', async () => {
		render(<MainStocks />);

		const text = await screen.findByTestId('alertPrice');
		expect(text).toBeInTheDocument();
	});
});
