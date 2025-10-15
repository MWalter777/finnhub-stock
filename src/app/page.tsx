import MainStocks from './components/MainStocks';

export default function Home() {
	return (
		<div className='font-sans min-h-screen flex flex-col justify-between items-center'>
			<MainStocks />
			<footer className='bg-red-400 flex gap-[24px] flex-wrap items-center justify-center w-full'>
				footer
			</footer>
		</div>
	);
}
