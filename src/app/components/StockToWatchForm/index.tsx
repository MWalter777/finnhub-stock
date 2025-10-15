import React, { useRef, useState } from 'react';
import { FormSection } from './index.styled';
import { Autocomplete, Button, TextField } from '@mui/material';
import { IStock } from '@/app/types/Stock';
import { useStockContext } from '@/app/Store/StockProvider';

type FormState = {
	stock: IStock | null;
	alertPrice: number | null;
};

const StockToWatchForm = () => {
	const autoCompletRef = useRef<any>(null);
	const alertPriceRef = useRef<any>(null);
	const { stocks, addStockHistory } = useStockContext();
	const [historicalStock, setHistoricalStock] = useState<FormState>({
		alertPrice: null,
		stock: null,
	});

	const handleStockChange = (_: any, value: IStock | null) => {
		if (value) {
			setHistoricalStock((prev) => ({
				...prev,
				stock: value,
			}));
		}
	};

	const handleAlertPrice = ({
		target: { value },
	}: {
		target: { value: string };
	}) => {
		if (value) {
			const alertPriceValue = parseInt(value);
			if (!isNaN(alertPriceValue)) {
				setHistoricalStock((prev) => ({
					...prev,
					alertPrice: alertPriceValue,
				}));
			}
		}
	};

	const addStock = () => {
		if (historicalStock?.stock && historicalStock?.alertPrice) {
			addStockHistory(historicalStock.stock, historicalStock.alertPrice);
			setHistoricalStock({
				alertPrice: 0,
				stock: null,
			});
			if (alertPriceRef.current && autoCompletRef.current) {
				alertPriceRef.current.value = '';
				autoCompletRef.current.value = '';
			}
			console.log({ alertPriceRef, autoCompletRef });
		}
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
					<TextField
						inputRef={autoCompletRef}
						{...params}
						label='Select a stock'
						variant='standard'
					/>
				)}
			/>
			<TextField
				id='price-alert'
				name='price-alert'
				label='Price alert'
				variant='standard'
				type='number'
				className='w-full mt-4'
				inputRef={alertPriceRef}
				onChange={handleAlertPrice}
			/>
			<Button
				onClick={addStock}
				type='button'
				variant='contained'
				className='w-full'
			>
				Add stock
			</Button>
		</FormSection>
	);
};

export default StockToWatchForm;
