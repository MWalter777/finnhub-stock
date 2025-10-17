if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker
			.register('/service-worker.js')
			.then((reg) => {
				console.log('Services worker installed:', reg);
			})
			.catch((err) => {
				console.error('Error while installing the services worker', err);
			});
	});
}
