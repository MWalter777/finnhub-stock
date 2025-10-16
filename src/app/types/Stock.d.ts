export interface IStock {
	currency: string;
	description: string;
	displaySymbol: string;
	figi: string;
	isin: string | null;
	mic: string;
	shareClassFIGI: string;
	symbol: string;
	symbol2: string;
	type: string;
}

export interface StreamStockPrice {
	c?: string;
	p: number;
	s: string;
	t: number;
	v: number;
}
