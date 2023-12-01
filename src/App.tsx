import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoadingIndicator } from './components/';

// Lazy load application chunks
const CalendarPage = React.lazy(async () => await import('./pages/Calendar/Calendar'));

function App() {
	return (
		<div className="App">
			<BrowserRouter>
				<Suspense fallback={<LoadingIndicator />}>
					<Routes>
						<Route path="/" Component={CalendarPage} />
					</Routes>
				</Suspense>
			</BrowserRouter>
		</div>
	);
}

export default App;
