import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router";
import { allRuns } from "./nrc-data";

function App() {
	const [search, setSearch] = useState("");
	const navigate = useNavigate();

	// Infer the type from the first run if available
	type RunType = (typeof allRuns)[number];

	// Enhanced search with debouncing and subtitle filtering
	const filteredRuns = useMemo(() => {
		if (!search.trim()) return allRuns;
		
		const searchTerm = search.toLowerCase().trim();
		return allRuns.filter((run: RunType) => {
			const titleMatch = run.landing.title.toLowerCase().includes(searchTerm);
			const subtitleMatch = run.landing.subtitle.toLowerCase().includes(searchTerm);
			return titleMatch || subtitleMatch;
		});
	}, [search]);

	const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(e.target.value);
	}, []);

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
			{/* Header Section */}
			<div className="bg-white shadow-sm border-b border-slate-200">
				<div className="max-w-7xl mx-auto px-4 py-8">
					<div className="text-center mb-8">
						<h1 className="text-4xl font-bold text-slate-900 mb-2">
							🏃‍♂️ Nike Run Club Library
						</h1>
						<p className="text-slate-600 text-lg">
							Discover your next perfect run from our curated collection
						</p>
					</div>
					
					{/* Search Bar */}
					<div className="max-w-2xl mx-auto relative">
						<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
							<svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
							</svg>
						</div>
						<input
							type="text"
							placeholder="Search runs by title or description..."
							value={search}
							onChange={handleSearchChange}
							className="w-full pl-12 pr-4 py-4 text-lg border border-slate-300 rounded-2xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-slate-400"
						/>
					</div>
					
					{/* Results Count */}
					<div className="text-center mt-6">
						<p className="text-slate-600">
							{search ? `Found ${filteredRuns.length} run${filteredRuns.length !== 1 ? 's' : ''}` : `${allRuns.length} total runs available`}
						</p>
					</div>
				</div>
			</div>
			
			{/* Main Content */}
			<div className="max-w-7xl mx-auto px-4 py-8">
				{filteredRuns.length > 0 ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{filteredRuns.map((run: RunType) => (
							<button 
								key={run.id} 
								type='button' 
								className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200 hover:border-blue-300 hover:-translate-y-1 text-left"
								onClick={() => navigate(`/${run.id}`)}
							>
								{/* Image */}
								<div className="aspect-[4/3] overflow-hidden bg-slate-100">
									<img
										src={run.landing.featuredUrl}
										alt={run.landing.title}
										className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
										onError={(e) => {
											const target = e.target as HTMLImageElement;
											target.style.display = 'none';
										}}
									/>
								</div>
								
								{/* Content */}
								<div className="p-5">
									<h3 className="font-semibold text-slate-900 text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
										{run.landing.title}
									</h3>
									<p className="text-slate-600 text-sm line-clamp-2">
										{run.landing.subtitle}
									</p>
									
									{/* Activity Type Badge */}
									<div className="mt-3">
										<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
											{run.properties?.activityType || 'RUN'}
										</span>
									</div>
								</div>
							</button>
						))}
					</div>
				) : (
					<div className="text-center py-16">
						<div className="mx-auto h-24 w-24 text-slate-400 mb-4">
							<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
							</svg>
						</div>
						<h3 className="text-xl font-medium text-slate-900 mb-2">No runs found</h3>
						<p className="text-slate-600 mb-6">Try adjusting your search terms or browse all available runs.</p>
						<button
							type="button"
							onClick={() => setSearch('')}
							className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
						>
							Clear search
						</button>
					</div>
				)}
			</div>
		</div>
	);
}

export default App;
