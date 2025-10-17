export const getColor = (i: number) => {
	const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088FE'];
	return colors[i % colors.length];
};
