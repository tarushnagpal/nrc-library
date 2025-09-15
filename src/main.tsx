import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import App from "./App.tsx";
import RunDetail from "./routes/run-detail.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<App />} />
        <Route path=":runId" element={<RunDetail />} />
			</Routes>
		</BrowserRouter>
	</StrictMode>,
);
