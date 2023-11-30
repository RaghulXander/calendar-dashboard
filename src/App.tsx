import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { State } from "./components/Loader/Loader";
// Lazy load application chunks
const CalendarPage = React.lazy(
	() => import("./pages/Calendar/Calendar")
);

function App() {
  return (
	  <div className="App">
		  <BrowserRouter>
			  <Suspense fallback={<State loading key="loading" />}>
				  <Routes>
					  <Route path="/" Component={CalendarPage} />
				  </Routes>
			  </Suspense>
		  </BrowserRouter>
    </div>
  );
}

export default App;
