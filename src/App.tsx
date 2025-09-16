import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { allRuns } from "./nrc-data";

function App() {
	const [searchParams, setSearchParams] = useSearchParams();
	const [search, setSearch] = useState("");
	const [isScrolled, setIsScrolled] = useState(false);
	const [visibleCount, setVisibleCount] = useState(12);
	const loadMoreRef = useRef<HTMLDivElement>(null);
	const navigate = useNavigate();

	// Initialize search from URL params on component mount
	useEffect(() => {
		const queryParam = searchParams.get("q");
		if (queryParam) {
			setSearch(queryParam);
		} else {
			setSearch("");
		}
	}, [searchParams]);

	// Track scroll position with debouncing
	useEffect(() => {
		const handleScroll = () => {
			const scrollY = window.scrollY;
			console.log(scrollY, 'scrolly')
            // Use different thresholds to prevent bouncing
            if (scrollY > 200) {
                setIsScrolled(true);
            } else if (scrollY < 2) {
                setIsScrolled(false);
            }
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	// Infer the type from the first run if available
	type RunType = (typeof allRuns)[number];

	// Enhanced search with multi-term support across different fields
	const filteredRuns = useMemo(() => {
		if (!search.trim()) return allRuns;

		const searchTerms = search.toLowerCase().trim().split(/\s+/);
		return allRuns.filter((run: RunType) => {
			const titleText = run.landing.title.toLowerCase();
			const subtitleText = run.landing.subtitle.toLowerCase();
			const coachText = run.detail.content
				.map((section) => section.title.toLowerCase())
				.join(" ");
			const combinedText = `${titleText} ${subtitleText} ${coachText}`;

			// All search terms must be found somewhere in the combined text
			return searchTerms.every((term) => combinedText.includes(term));
		});
	}, [search]);

	// Get visible runs for virtualization
	const visibleRuns = useMemo(() => {
		return filteredRuns.slice(0, visibleCount);
	}, [filteredRuns, visibleCount]);

	// Intersection observer for infinite loading
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && visibleCount < filteredRuns.length) {
					setVisibleCount((prev) => Math.min(prev + 12, filteredRuns.length));
				}
			},
			{ threshold: 0.1 },
		);

		if (loadMoreRef.current) {
			observer.observe(loadMoreRef.current);
		}

		return () => observer.disconnect();
	}, [visibleCount, filteredRuns.length]);

	// Reset visible count when search changes
	useEffect(() => {
		setVisibleCount(12);
	}, [search]);

	const handleSearchChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const newSearch = e.target.value;
			const oldSearch = search;
			setSearch(newSearch);

			// Update URL search params
			if (newSearch.trim()) {
				setSearchParams(
					{ q: newSearch },
					{ replace: oldSearch.length ? true : false },
				);
			} else {
				setSearchParams({});
			}
		},
		[setSearchParams, search],
	);

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
			{/* Sticky Header Section */}
			<div
				className={`sticky top-0 z-50 bg-white shadow-sm border-b border-slate-200 transition-all duration-300 ${
					isScrolled ? "py-3" : "py-8"
				}`}
			>
				<div className="max-w-7xl mx-auto px-4 relative">
					{/* GitHub Link - positioned absolutely */}
					<div className="absolute right-0 top-0 z-10">
						<a
							href="https://github.com/tarushnagpal/nrc-library"
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center p-2 text-slate-600 hover:text-slate-900 transition-colors"
							title="View on GitHub"
						>
							<svg
								className="w-6 h-6"
								fill="currentColor"
								viewBox="0 0 24 24"
								role="img"
								aria-label="GitHub"
							>
								<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
							</svg>
						</a>
					</div>

					{/* Title - hidden when scrolled */}
					<div
						className={`text-center transition-all duration-300 ${
							isScrolled
								? "mb-0 opacity-0 h-0 overflow-hidden"
								: "mb-8 opacity-100"
						}`}
					>
						<h1 className="text-4xl font-bold text-slate-900 mb-2">
							🏃‍♂️ Nike Run Club Library
						</h1>
						<p className="text-slate-600 text-lg">
							Discover your next perfect run from our curated collection
						</p>
					</div>

					{/* Search Bar - always visible */}
					<div
						className={`mx-auto relative transition-all duration-300 ${
							isScrolled ? "max-w-lg" : "max-w-2xl"
						}`}
					>
						<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
							<svg
								className="h-5 w-5 text-slate-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								role="img"
								aria-label="Search"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								/>
							</svg>
						</div>
						<input
							type="text"
							placeholder="Search runs by Title, Description or Coach name"
							value={search}
							onChange={handleSearchChange}
							className={`w-full pl-12 pr-4 border border-slate-300 rounded-2xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-slate-400 ${
								isScrolled ? "py-3 text-base" : "py-4 text-lg"
							}`}
						/>
					</div>

					{/* Results Count - hidden when scrolled */}
					<div
						className={`text-center transition-all duration-300 flex flex-col md:flex-row items-center justify-center gap-2 ${
							isScrolled
								? "mt-0 opacity-0 h-0 overflow-hidden"
								: "mt-6 opacity-100"
						}`}
					>
						<p className="text-slate-600">
							{search
								? `Found ${filteredRuns.length} run${filteredRuns.length !== 1 ? "s" : ""}`
								: `${allRuns.length} total runs available`}
						</p>
						<p className="text-xs hidden md:block">○</p>
						<p className="text-slate-600 text-xs">
							Last updated 16th September, 2025
						</p>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="max-w-7xl mx-auto px-4 py-8">
				{filteredRuns.length > 0 ? (
					<>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{visibleRuns.map((run: RunType) => (
								<button
									key={run.id}
									type="button"
									className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200 hover:border-blue-300 hover:-translate-y-1 text-left"
									onClick={() => navigate(`/${run.id}`)}
								>
									{/* Image */}
									<div className="aspect-[4/3] overflow-hidden bg-slate-100">
										<img
											src={run.landing.featuredUrl}
											alt={run.landing.title}
											loading="lazy"
											className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
											onError={(e) => {
												const target = e.target as HTMLImageElement;
												target.style.display = "none";
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
												{run.properties?.activityType || "RUN"}
											</span>
										</div>
									</div>
								</button>
							))}
						</div>

						{/* Load More Trigger & Loading Indicator */}
						{visibleCount < filteredRuns.length && (
							<div ref={loadMoreRef} className="flex justify-center py-8">
								<div className="flex items-center space-x-2 text-slate-600">
									<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
									<span>Loading more runs...</span>
								</div>
							</div>
						)}

						{/* Show total count */}
						{visibleCount >= filteredRuns.length &&
							filteredRuns.length > 12 && (
								<div className="text-center py-8">
									<p className="text-slate-600">
										Showing all {filteredRuns.length} runs
									</p>
								</div>
							)}
					</>
				) : (
					<div className="text-center py-16">
						<div className="mx-auto h-24 w-24 text-slate-400 mb-4">
							<svg
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								className="w-full h-full"
								role="img"
								aria-label="No runs found"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={1}
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								/>
							</svg>
						</div>
						<h3 className="text-xl font-medium text-slate-900 mb-2">
							No runs found
						</h3>
						<p className="text-slate-600 mb-6">
							Try adjusting your search terms or browse all available runs.
						</p>
						<button
							type="button"
							onClick={() => {
								setSearch("");
								setSearchParams({});
							}}
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
