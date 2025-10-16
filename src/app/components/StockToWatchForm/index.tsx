import React, { useRef, useState } from 'react';
import { FormSection } from './index.styled';
import { Autocomplete, Button, TextField } from '@mui/material';
import { IStock } from '@/app/types/Stock';
import { useStockContext } from '@/app/Store/StockProvider';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

type FormState = {
	stock: IStock | null;
	alertPrice: number | null;
};

const MAX_STOCKS = 7;

const StockToWatchForm = () => {
	const {
		register,
		control,
		reset,
		handleSubmit,
		formState: { errors },
	} = useForm<FormState>({
		defaultValues: {
			stock: null,
			alertPrice: null,
		},
	});
	const { stocks, addStockHistory, stockHistory } = useStockContext();

	const onSubmit: SubmitHandler<FormState> = (data) => {
		if (data.stock && data.alertPrice !== null) {
			addStockHistory(data.stock, data.alertPrice);
		}
		reset({
			stock: null,
			alertPrice: null,
		});
	};

	return (
		<FormSection onSubmit={handleSubmit(onSubmit)}>
			<Controller
				name='stock'
				control={control}
				rules={{ required: 'Please select a stock' }}
				render={({ field, fieldState }) => (
					<Autocomplete
						disablePortal
						options={stocks}
						getOptionLabel={(option) => option.symbol}
						isOptionEqualToValue={(option, value) =>
							option.symbol === value.symbol
						}
						className='w-full'
						value={field.value}
						onChange={(_, newValue) => field.onChange(newValue)}
						disabled={stockHistory.length >= MAX_STOCKS}
						renderInput={(params) => (
							<TextField
								{...params}
								error={!!fieldState.error}
								helperText={fieldState.error?.message}
								label='Select a stock'
								variant='standard'
							/>
						)}
					/>
				)}
			/>
			<TextField
				id='alertPrice'
				label='Price alert'
				variant='standard'
				type='number'
				error={!!errors.alertPrice}
				helperText={errors.alertPrice?.message}
				disabled={stockHistory.length >= MAX_STOCKS}
				slotProps={{
					input: {
						// @ts-ignore
						inputProps: {
							step: 'any',
						},
					},
				}}
				inputMode='decimal'
				className='w-full mt-4'
				{...register('alertPrice', {
					valueAsNumber: true,
					required: 'Price is required',
					min: {
						value: 0.0,
						message: 'Price must be greater or equal than 0',
					},
				})}
			/>
			<Button
				disabled={stockHistory.length >= MAX_STOCKS}
				type='submit'
				variant='contained'
				className='w-full'
			>
				Add stock
			</Button>
		</FormSection>
	);
};

export default StockToWatchForm;
