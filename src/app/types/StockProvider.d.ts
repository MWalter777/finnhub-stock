export type StockPricePoint = {
	timestamp: number;
	price: number;
	prevPrice: number;
};

export type StockHistory = {
	stock: IStock;
	alertPrice: number;
	prices: StockPricePoint[];
};
