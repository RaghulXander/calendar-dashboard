import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Lazy load application chunks
const CalendarPage = React.lazy(async () => await import('./pages/Calendar/Calendar'));

function App() {
	return (
		<div className="App">
			<BrowserRouter>
				<Suspense fallback={<div>Loading...</div>}>
					<Routes>
						<Route path="/" Component={CalendarPage} />
					</Routes>
				</Suspense>
			</BrowserRouter>
		</div>
	);
}

export default App;
