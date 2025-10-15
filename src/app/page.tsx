import GraphStocks from './components/GraphStocks';
import StockToWatchForm from './components/StockToWatchForm';
import TopCards from './components/TopCards';

export default function Home() {
	return (
		<div className='font-sans min-h-screen flex flex-col justify-between items-center'>
			<main className='flex flex-col gap-4 w-full items-center md:w-10/12'>
				<div className='w-full flex flex-col gap-4 md:flex-row'>
					<StockToWatchForm />
					<TopCards />
				</div>
				<GraphStocks />
				<section></section>
			</main>
			<footer className='bg-red-400 flex gap-[24px] flex-wrap items-center justify-center w-full'>
				footer
			</footer>
		</div>
	);
}
