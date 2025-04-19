import React, { useState } from "react";
import coastImage from "../../assets/images/coast.jpg";
import erosionSvg from "../../assets/images/erosion.png";
import solutionSvg from "../../assets/images/eroSol.webp";
import EnvironmentBeachLayers from "../../assets/EnvironmentBeachLayers";
import { ChevronDown, ChevronUp } from "lucide-react";

const Beach = () => {
	const [isCaseStudyOpen, setIsCaseStudyOpen] = useState(false);
	const [isMoreStudiesOpen, setIsMoreStudiesOpen] = useState(false);

	const toggleCaseStudy = () => {
		setIsCaseStudyOpen(!isCaseStudyOpen);
	};

	const toggleMoreStudies = () => {
		setIsMoreStudiesOpen(!isMoreStudiesOpen);
	};

	return (
		<div className="min-h-screen">
			<EnvironmentBeachLayers>
				<main className="container mx-auto py-12 px-4">
					<div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 max-w-4xl mx-auto border border-yellow-300/40 space-y-10">
						<header className="text-center">
							<h1 className="text-4xl md:text-5xl font-bold text-yellow-800 mb-4">
								Coastal Erosion
							</h1>
							<p className="text-lg md:text-xl text-gray-700">
								Understanding how our coastlines are changing and what we can do to protect them.
							</p>
						</header>

						<img
							src={coastImage}
							alt="Eroded coastline"
							className="rounded-xl w-full h-64 object-cover shadow-md border border-yellow-200"
						/>

						<section className="grid md:grid-cols-2 gap-6 items-center">
							<div>
								<h2 className="text-2xl font-semibold text-yellow-700 mb-2">
									What is Coastal Erosion?
								</h2>
								<p className="text-gray-800 text-lg">
									Coastal erosion is the process by which coastlines are worn away due to natural forces like waves, tides, and currents — often made worse by human activity and climate change.
								</p>
							</div>
							<img
								src={erosionSvg}
								alt="Erosion illustration"
								className="w-full max-h-64 object-contain"
							/>
						</section>

						<section>
							<h2 className="text-2xl font-semibold text-yellow-700 mb-4">
								Causes of Coastal Erosion
							</h2>
							<div className="grid sm:grid-cols-2 gap-4 text-gray-800 text-lg">
								<div className="bg-yellow-100 p-4 rounded-lg shadow-sm">
									🌊 Rising sea levels
								</div>
								<div className="bg-yellow-100 p-4 rounded-lg shadow-sm">
									💨 Strong winds and storms
								</div>
								<div className="bg-yellow-100 p-4 rounded-lg shadow-sm">
									🏗️ Coastal development and construction
								</div>
								<div className="bg-yellow-100 p-4 rounded-lg shadow-sm">
									🚢 Human interference with sediment flow
								</div>
								<div className="bg-yellow-100 p-4 rounded-lg shadow-sm">
									🌧️ Heavy rainfall and runoff
								</div>
							</div>
						</section>

						<section>
							<h2 className="text-2xl font-semibold text-yellow-700 mb-4">
								Effects of Coastal Erosion
							</h2>
							<ul className="list-disc pl-6 text-gray-800 text-lg space-y-2">
								<li>Loss of land and property along coastlines</li>
								<li>Damage to infrastructure and ecosystems</li>
								<li>Saltwater intrusion into freshwater systems</li>
								<li>Displacement of coastal communities</li>
								<li>Loss of tourism and local economies</li>
							</ul>
						</section>

						<section className="grid md:grid-cols-2 gap-6 items-center">
							<img
								src={solutionSvg}
								alt="Coastal protection"
								className="w-full max-h-64 object-contain"
							/>
							<div>
								<h2 className="text-2xl font-semibold text-yellow-700 mb-2">
									Solutions to Coastal Erosion
								</h2>
								<ul className="list-disc pl-6 text-gray-800 text-lg space-y-2">
									<li>Building sea walls and breakwaters</li>
									<li>Beach nourishment and dune restoration</li>
									<li>Establishing buffer zones and setbacks</li>
									<li>Planting vegetation to stabilize shorelines</li>
									<li>Limiting development in vulnerable areas</li>
								</ul>
							</div>
						</section>

						<section>
							<h2 className="text-2xl font-semibold text-yellow-700 mb-4">
								What You Can Do
							</h2>
							<ul className="list-disc pl-6 text-gray-800 text-lg space-y-2">
								<li>Support local and global coastal protection initiatives</li>
								<li>Reduce your carbon footprint to combat climate change</li>
								<li>Volunteer in beach cleanups and conservation efforts</li>
								<li>Stay informed and advocate for smart coastal planning</li>
								<li>Respect coastal regulations and avoid damaging habitats</li>
							</ul>
						</section>

						{/* Case Study Section */}
						<section className="border border-yellow-200 rounded-xl overflow-hidden bg-gradient-to-br from-yellow-50 to-white">
							<div
								className="flex items-center justify-between p-4 cursor-pointer"
								onClick={toggleCaseStudy}
							>
								<h2 className="text-2xl font-semibold text-yellow-700">
									Case Study: California's Shrinking Shorelines
								</h2>
								<button
									className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 p-2 rounded-full transition-all duration-300"
									aria-label={
										isCaseStudyOpen ? "Close case study" : "Open case study"
									}
								>
									{isCaseStudyOpen ? (
										<ChevronUp size={24} />
									) : (
										<ChevronDown size={24} />
									)}
								</button>
							</div>

							<div
								className={`transition-all duration-500 ease-in-out overflow-hidden ${
									isCaseStudyOpen
										? "max-h-screen opacity-100 py-4 px-6"
										: "max-h-0 opacity-0 p-0"
								}`}
							>
								<div className="grid md:grid-cols-3 gap-6 mb-6">
									<div className="bg-white rounded-lg p-4 shadow-sm border border-yellow-100">
										<h3 className="text-lg font-medium text-yellow-700 mb-2">
											The Challenge
										</h3>
										<p className="text-gray-700">
											California has lost over 25% of its beaches since 1972, with some coastal communities seeing shorelines retreat by up to 8 feet per year. This trend accelerated with rising sea levels and increased storm intensity.
										</p>
									</div>
									<div className="bg-white rounded-lg p-4 shadow-sm border border-yellow-100">
										<h3 className="text-lg font-medium text-yellow-700 mb-2">
											The Response
										</h3>
										<p className="text-gray-700">
											The California Coastal Resilience Initiative launched in 2018 combines strategic retreat with natural solutions. Key projects included dune restoration at 17 beaches and managed retreat of infrastructure at high-risk locations.
										</p>
									</div>
									<div className="bg-white rounded-lg p-4 shadow-sm border border-yellow-100">
										<h3 className="text-lg font-medium text-yellow-700 mb-2">
											The Results
										</h3>
										<p className="text-gray-700">
											Areas with restored dune systems withstood storm surges 60% better than hardened shorelines. Property damage was reduced by $183 million during the 2022 winter storms in areas with implemented strategies.
										</p>
									</div>
								</div>

								<div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200 mb-6">
									<h3 className="text-xl font-medium text-yellow-700 mb-3">
										Key Success Factors
									</h3>
									<ul className="grid md:grid-cols-2 gap-4">
										<li className="flex items-start">
											<div className="text-yellow-600 font-bold mr-2">1.</div>
											<p className="text-gray-700">
												Hybrid approaches combining natural solutions with strategic engineering
											</p>
										</li>
										<li className="flex items-start">
											<div className="text-yellow-600 font-bold mr-2">2.</div>
											<p className="text-gray-700">
												Early community involvement in planning and decision-making processes
											</p>
										</li>
										<li className="flex items-start">
											<div className="text-yellow-600 font-bold mr-2">3.</div>
											<p className="text-gray-700">
												Long-term monitoring programs with adaptive management strategies
											</p>
										</li>
										<li className="flex items-start">
											<div className="text-yellow-600 font-bold mr-2">4.</div>
											<p className="text-gray-700">
												Innovative funding mechanisms combining public and private investments
											</p>
										</li>
									</ul>
								</div>

								<div
									className="cursor-pointer flex items-center justify-between p-4 mt-4 bg-yellow-100 rounded-lg border border-yellow-300"
									onClick={toggleMoreStudies}
								>
									<h3 className="text-lg font-medium text-yellow-700">
										View More Case Studies
									</h3>
									{isMoreStudiesOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
								</div>

								<div
									className={`transition-all duration-500 ease-in-out overflow-hidden ${
										isMoreStudiesOpen
											? "max-h-screen opacity-100 pt-4"
											: "max-h-0 opacity-0"
									}`}
								>
									<ul className="list-disc pl-6 text-gray-700 space-y-3 pt-2">
										<li>
											<b>Miami Beach's Living Shorelines:</b> Using mangrove restoration and artificial reefs to protect urban coastlines.
										</li>
										<li>
											<b>Netherlands' Sand Motor:</b> An innovative "building with nature" approach using massive sand nourishment.
										</li>
										<li>
											<b>Japan's Tetrapod Deployment:</b> Concrete structures to dissipate wave energy along vulnerable coastlines.
										</li>
										<li>
											<b>United Kingdom's Managed Retreat:</b> Strategically abandoning certain coastal defenses to create natural buffers.
										</li>
									</ul>
								</div>
							</div>
						</section>

						<footer className="text-center mt-8">
							<p className="text-yellow-800 text-lg">
								🌴 Every effort helps protect our coastlines for future generations.
							</p>
						</footer>
					</div>
				</main>
			</EnvironmentBeachLayers>
		</div>
	);
};

export default Beach;