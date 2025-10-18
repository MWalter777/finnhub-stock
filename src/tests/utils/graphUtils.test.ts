import {
	getColor,
	mergeAllDataHistory,
	mergeHistory,
} from '@/utils/graphUtils';

describe('graphUtils test', () => {
	test('getColor', () => {
		const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088FE'];
		for (let i = 0; i < 10; i++) {
			expect(getColor(i)).toBe(colors[i % colors.length]);
		}
	});

	it('mergeHistory', () => {
		const merged = mergeHistory({
			stock: { symbol: 'AAPL' },
			prices: [
				{ timestamp: 1, price: 150 },
				{ timestamp: 2, price: 152 },
				{ timestamp: 4, price: 155 },
			],
		} as any);
		expect(merged).toEqual([
			{ time: 1, AAPL: 150 },
			{ time: 2, AAPL: 152 },
			{ time: 4, AAPL: 155 },
		]);
	});

	it('mergeAllDataHistory', () => {
		const merged = mergeAllDataHistory([
			{
				stock: { symbol: 'AAPL' },
				prices: [
					{ timestamp: 1, price: 150 },
					{ timestamp: 2, price: 152 },
					{ timestamp: 4, price: 155 },
				],
			} as any,
			{
				stock: { symbol: 'GOOG' },
				prices: [
					{ timestamp: 2, price: 2700 },
					{ timestamp: 3, price: 2720 },
					{ timestamp: 4, price: 2750 },
				],
			} as any,
		]);
		expect(merged).toEqual([
			{ time: 1, AAPL: 150, GOOG: null },
			{ time: 2, AAPL: 152, GOOG: 2700 },
			{ time: 3, AAPL: 152, GOOG: 2720 },
			{ time: 4, AAPL: 155, GOOG: 2750 },
		]);
	});
	it('mergeHistory with undefined history', () => {
		const merged = mergeHistory(undefined);
		expect(merged).toEqual([]);
	});
});
