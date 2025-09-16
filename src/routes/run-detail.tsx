import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { allRuns } from "../nrc-data";
import { generateRunUrl } from "../util";

export default function RunDetail() {
	const { runId } = useParams();
	const navigate = useNavigate();
	const [run, setRun] = useState<(typeof allRuns)[number] | undefined>(
		undefined,
	);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const foundRun = allRuns.find((r) => r.id === runId);
		setRun(foundRun);
		setIsLoading(false);
	}, [runId]);

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p className="text-slate-600">Loading run details...</p>
				</div>
			</div>
		);
	}

	if (!run) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
				<div className="text-center">
					<h2 className="text-2xl font-bold text-slate-900 mb-4">
						Run not found
					</h2>
					<p className="text-slate-600 mb-6">
						The run you're looking for doesn't exist.
					</p>
					<button
						onClick={() => navigate("/")}
						type="button"
						className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
					>
						← Back to Library
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
			{/* Navigation */}
			<div className="bg-white shadow-sm border-b border-slate-200">
				<div className="max-w-4xl mx-auto px-4 py-4">
					<button
						type="button"
						onClick={() => navigate("/")}
						className="inline-flex items-center text-slate-600 hover:text-slate-900 transition-colors"
					>
						<svg
							className="w-5 h-5 mr-2"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							role="img"
							aria-label="Back to Library"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M15 19l-7-7 7-7"
							/>
						</svg>
						Back to Library
					</button>
				</div>
			</div>

			{/* Hero Section */}
			<div
				className="relative overflow-hidden"
				style={{ backgroundColor: run.detail.headerCard.backgroundColor }}
			>
				{/* Background Image */}
				{run.detail.headerCard.url && (
					<div
						className="absolute inset-0 bg-cover bg-no-repeat"
						style={{
							backgroundImage: `url(${run.detail.headerCard.url})`,
							backgroundPosition: "50% 25%",
						}}
					></div>
				)}
				{/* Gradient overlay for better text readability */}
				<div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70"></div>
				<div className="relative max-w-4xl mx-auto px-4 py-16">
					<div className="text-center">
						<h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
							{run.detail.headerCard.title}
						</h1>
						<p className="text-xl text-white opacity-90 drop-shadow-md mb-8">
							{run.detail.headerCard.subtitle}
						</p>

						{/* Run Properties */}
						<div className="flex flex-wrap justify-center gap-4 mt-8">
							{run.properties?.activityType && (
								<span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white bg-opacity-90 text-slate-800 backdrop-blur-sm shadow-lg">
									📊 {run.properties.activityType}
								</span>
							)}
							{run.properties?.goal && (
								<span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white bg-opacity-90 text-slate-800 backdrop-blur-sm shadow-lg">
									🎯 {run.properties.goal}{" "}
									{run.properties.activityType === "DURATION"
										? "seconds"
										: "units"}
								</span>
							)}
						</div>

						<div className="mt-10 flex justify-center">
							<button
								type="button"
								className="rounded-full bg-gradient-to-r from-emerald-700 to-teal-800 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:from-emerald-600 hover:to-teal-700 active:scale-95 transition"
								onClick={() => {window.open(generateRunUrl(run.id))}}
							>
								Run 🏃
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Content Sections */}
			<div className="max-w-4xl mx-auto px-4 py-12">
				<div className="space-y-8">
					{run.detail.content.map((section, index) => {
						if (section.type === "TEXT" && section.body) {
							return (
								<div
									key={section.title}
									className="bg-white rounded-2xl shadow-lg overflow-hidden"
								>
									<div className="px-8 py-6">
										<h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
											{index === 0 && "📖"} {section.title}
										</h2>
										<div
											className="prose prose-slate max-w-none text-slate-700 leading-relaxed"
											// biome-ignore lint/security/noDangerouslySetInnerHtml: Content from trusted source
											dangerouslySetInnerHTML={{ __html: section.body }}
										/>
									</div>
								</div>
							);
						}

						if (section.type === "MUSIC") {
							return (
								<div
									key={section.title}
									className="bg-white rounded-2xl shadow-lg overflow-hidden"
								>
									<div className="px-8 py-6">
										<h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
											🎵 {section.title}
										</h2>
										<div className="flex flex-col md:flex-row items-start gap-6">
											<img
												src={section.url}
												alt="Music Cover"
												className="w-48 h-48 object-cover rounded-xl shadow-md"
											/>
											<div className="flex-1">
												<p className="text-slate-600 mb-6">
													Listen to the perfect soundtrack for this run:
												</p>
												<div className="flex flex-wrap gap-3">
													{section.providers.map((provider) => (
														<a
															key={provider.url}
															href={provider.url}
															target="_blank"
															rel="noreferrer"
															className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
																provider.type === "APPLE_MUSIC"
																	? "bg-black text-white hover:bg-gray-800"
																	: "bg-green-500 text-white hover:bg-green-600"
															}`}
														>
															{provider.type === "APPLE_MUSIC" ? (
																<>
																	<svg
																		className="w-5 h-5 mr-2"
																		viewBox="0 0 24 24"
																		fill="currentColor"
																		role="img"
																		aria-label="Apple Music"
																	>
																		<path d="M23.997 6.124c0-.738-.065-1.47-.24-2.19-.317-1.31-1.062-2.31-2.18-3.043C21.003.517 20.373.285 19.7.164c-.517-.093-1.038-.135-1.564-.14C17.473 0 16.812 0 16.15 0H7.85c-.662 0-1.323 0-1.986.024-.526.005-1.047.047-1.564.14-.673.121-1.303.353-1.877.727C1.302 1.624.557 2.624.24 3.934.065 4.654 0 5.386 0 6.124v11.752c0 .738.065 1.47.24 2.19.317 1.31 1.062 2.31 2.18 3.043.574.374 1.204.606 1.877.727.517.093 1.038.135 1.564.14.663.024 1.324.024 1.986.024h8.3c.662 0 1.323 0 1.986-.024.526-.005 1.047-.047 1.564-.14.673-.121 1.303-.353 1.877-.727 1.118-.733 1.863-1.733 2.18-3.043.175-.72.24-1.452.24-2.19V6.124z" />
																	</svg>
																	Apple Music
																</>
															) : (
																<>
																	<svg
																		className="w-5 h-5 mr-2"
																		viewBox="0 0 24 24"
																		fill="currentColor"
																		role="img"
																		aria-label="Spotify"
																	>
																		<path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
																	</svg>
																	Spotify
																</>
															)}
														</a>
													))}
												</div>
											</div>
										</div>
									</div>
								</div>
							);
						}

						return null;
					})}
				</div>
			</div>
		</div>
	);
}
