'use client';
import React, { useEffect, useState } from 'react';
import { FormSection } from './index.styled';
import { Autocomplete, TextField } from '@mui/material';
import { IStock } from '@/app/types/Stock';

const url = `https://finnhub.io/api/v1/stock/symbol?exchange=US&token=${process.env.NEXT_PUBLIC_FINNHUB_API_KEY}`;

const fetchStocks = async (): Promise<IStock[]> => {
	const response = await fetch(url);
	const data = await response.json();
	return data;
};

const StockToWatchForm = () => {
	const [stocks, setStocks] = useState<IStock[]>([]);
	useEffect(() => {
		const getStocks = async () => {
			const stocksFromLocalStorage = localStorage.getItem('stocks');
			if (stocksFromLocalStorage) {
				setStocks(JSON.parse(stocksFromLocalStorage));
				console.log(JSON.parse(stocksFromLocalStorage));
				return;
			}
			const stocksFromApi = await fetchStocks();
			const stocks = stocksFromApi.slice(0, 100);
			setStocks(stocks);
			localStorage.setItem('stocks', JSON.stringify(stocks));
		};
		getStocks();
	}, []);

	const handleStockChange = (_: any, value: IStock | null) => {
		console.log(value);
	};
	return (
		<FormSection>
			<Autocomplete
				disablePortal
				options={stocks}
				getOptionLabel={(option) => option.symbol}
				isOptionEqualToValue={(option, value) => option.symbol === value.symbol}
				className='w-full'
				id='stock-selected'
				onChange={handleStockChange}
				renderInput={(params) => (
					<TextField {...params} label='Select a stock' variant='standard' />
				)}
			/>
			<TextField
				id='price-alert'
				name='price-alert'
				label='Price alert'
				variant='standard'
				type='number'
				className='w-full mt-4'
			/>
		</FormSection>
	);
};

export default StockToWatchForm;
