import { StockHistory } from '@/types/StockProvider';

export const getColor = (i: number) => {
	const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088FE'];
	return colors[i % colors.length];
};

export function mergeHistory(history: StockHistory) {
	const merged: {
		[x: string]: number | null;
	}[] = [];
	if (!history) return merged;
	const symbols = history.stock.symbol;
	const allTimestamps = new Set<number>();
	const last30Prices = history.prices.filter(
		(_, i) => i >= history.prices.length - 30
	);
	last30Prices.forEach((p) => allTimestamps.add(p.timestamp));

	const sortedTimestamps = Array.from(allTimestamps).sort((a, b) => a - b);

	const lastValues: Record<string, number> = {};
	sortedTimestamps.forEach((ts) => {
		const point: { [key in string]: number | null } = { time: ts };
		const pricePoint = history?.prices.find((p) => p.timestamp === ts);
		if (pricePoint) lastValues[symbols] = pricePoint.price;
		point[symbols] = lastValues[symbols] ?? null;
		merged.push(point);
	});

	return merged;
}

export function mergeAllDataHistory(history: StockHistory[]) {
	const merged: {
		[x: string]: number | null;
	}[] = [];
	const symbols = history.map((h) => h.stock.symbol);
	const allTimestamps = new Set<number>();

	history.forEach((h) => {
		const last30Prices = h.prices.filter((_, i) => i >= h.prices.length - 30);
		last30Prices.forEach((p) => allTimestamps.add(p.timestamp));
	});

	const sortedTimestamps = Array.from(allTimestamps).sort((a, b) => a - b);

	const lastValues: Record<string, number> = {};
	sortedTimestamps.forEach((ts) => {
		const point: { [key in string]: number | null } = { time: ts };
		symbols.forEach((sym) => {
			const pricePoint = history
				.find((h) => h.stock.symbol === sym)
				?.prices.find((p) => p.timestamp === ts);
			if (pricePoint) lastValues[sym] = pricePoint.price;
			point[sym] = lastValues[sym] ?? null;
		});
		merged.push(point);
	});

	return merged;
}
