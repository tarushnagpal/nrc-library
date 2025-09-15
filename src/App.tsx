import { useState } from "react";
import "./App.css";
import { useNavigate } from "react-router";
import { allRuns } from "./nrc-data";

function App() {
	const [search, setSearch] = useState("");
	const navigate = useNavigate();

	// Infer the type from the first run if available
	type RunType = (typeof allRuns)[number];

	const filteredRuns = allRuns.filter((run: RunType) =>
		run.landing.title.toLowerCase().includes(search.toLowerCase()),
	);

	return (
		<>
			<h2 className="library-title">Run Library</h2>
			<input
				type="text"
				placeholder="Search by title or description..."
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				className="library-search"
			/>
			<div className="library-grid">
				{filteredRuns.map((run: RunType) => (
					<button key={run.id} type='button' className="run-card" onClick={() => navigate(`/${run.id}`)}>
						<div className="run-image-wrapper">
							<img
								src={run.landing.featuredUrl}
								alt={run.landing.title}
								className="run-image"
							/>
						</div>
						<div className="run-content">
							<h3 className="run-title">{run.landing.title}</h3>
							<p className="run-subtitle">{run.landing.subtitle}</p>
						</div>
					</button>
				))}
				{filteredRuns.length === 0 && <p className="no-runs">No runs found.</p>}
			</div>
			<p className="read-the-docs">
				Click on the Vite and React logos to learn more
			</p>
		</>
	);
}

export default App;
