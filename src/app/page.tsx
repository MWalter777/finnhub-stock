'use client';
import { Box } from '@mui/material';
import MainStocks from './components/MainStocks';
import StockProvider from './Store/StockProvider';

export default function Home() {
	return (
		<Box
			component='main'
			className='font-sans flex flex-col justify-between items-center'
			mt={{
				xs: '56px',
				sm: '64px',
				md: '70px',
			}}
		>
			<StockProvider>
				<MainStocks />
			</StockProvider>
		</Box>
	);
}
