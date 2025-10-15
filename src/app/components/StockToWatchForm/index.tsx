'use client';
import React from 'react';
import { FormSection } from './index.styled';
import { Autocomplete, TextField } from '@mui/material';

const StockToWatchForm = () => {
	const options = [
		{ id: 1, name: 'The Shawshank Redemption', label: 'Shawshank' },
		{ id: 2, name: 'The Godfather', label: 'Godfather' },
		{ id: 3, name: 'The Dark Knight', label: 'Dark Knight' },
	];
	const handleStockChange = (
		_: any,
		value: {
			id: number;
			name: string;
			label: string;
		} | null
	) => {
		console.log(value);
	};
	return (
		<FormSection>
			<Autocomplete
				disablePortal
				options={options}
				getOptionLabel={(option) => option.label}
				isOptionEqualToValue={(option, value) => option.id === value.id}
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
