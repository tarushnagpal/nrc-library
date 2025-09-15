import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { allRuns } from "../nrc-data";

export default function RunDetail() {
	const { runId } = useParams();
	const [run, setRun] = useState<(typeof allRuns)[number] | undefined>(
		undefined,
	);

	useEffect(() => {
		const run = allRuns.find((r) => r.id === runId);
		setRun(run);
	}, [runId]);

	if (!run) return <p>Loading...</p>;

	return (
		<div className="run-detail">
			{/* Header Banner */}
			<div
				className="run-header"
				style={{
					backgroundColor: run.detail.headerCard.backgroundColor,
					color: run.detail.headerCard.titleColor,
				}}
			>
				<img
					src={run.detail.headerCard.url}
					alt={run.landing.title}
					className="run-header-image"
				/>
				<div className="run-header-text">
					<h1>{run.detail.headerCard.title}</h1>
					<h3>{run.detail.headerCard.subtitle}</h3>
				</div>
			</div>

			{/* Content Sections */}
			<div className="run-sections">
				{run.detail.content.map((section) => {
					if (section.type === "TEXT" && section.body) {
						return (
							<div
								key={section.title}
								className="run-section"
								style={{ backgroundColor: section.backgroundColor }}
							>
								<h2 style={{ color: section.titleColor }}>{section.title}</h2>
								<div
									className="run-body"
									// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
									dangerouslySetInnerHTML={{ __html: section.body }}
								/>
							</div>
						);
					}

					if (section.type === "MUSIC") {
						return (
							<div
								key={section.title}
								className="run-section"
								style={{ backgroundColor: "#111111", color: "#fff" }}
							>
								<h2>{section.title}</h2>
								<img
									src={section.url}
									alt="Music Cover"
									className="music-img"
								/>
								<div className="music-links">
									{section.providers.map((p, i) => (
										<a
											key={p.url}
											href={p.url}
											target="_blank"
											rel="noreferrer"
											className="music-link"
										>
											{p.type === "APPLE_MUSIC"
												? "Listen on Apple Music"
												: "Listen on Spotify"}
										</a>
									))}
								</div>
							</div>
						);
					}

					return null;
				})}
			</div>
		</div>
	);
}
