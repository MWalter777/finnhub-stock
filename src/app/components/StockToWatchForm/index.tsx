import React from 'react';
import { FormSection } from './index.styled';
import { Autocomplete, TextField } from '@mui/material';
import { IStock } from '@/app/types/Stock';
import { useStockContext } from '@/app/Store/StockProvider';

const StockToWatchForm = () => {
	const { stocks, stockSelected, setStockSelected } = useStockContext();
	const handleStockChange = (_: any, value: IStock | null) => {
		setStockSelected(value);
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
				value={stockSelected}
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
