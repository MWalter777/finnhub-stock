import React from 'react';
import { FormSection } from './index.styled';
import { Autocomplete, Button, TextField } from '@mui/material';
import { IStock } from '@/app/types/Stock';
import { useStockContext } from '@/app/Store/StockProvider';

const StockToWatchForm = () => {
	const { stocks, addStockHistory } = useStockContext();
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
			<Button type='button' variant='contained' className='w-full'>
				Add stock
			</Button>
		</FormSection>
	);
};

export default StockToWatchForm;
