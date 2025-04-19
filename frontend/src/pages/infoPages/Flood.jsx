import React, { useState } from "react";
import floodImage from "../../assets/images/floodingtop.jpg";
import floodSvg from "../../assets/images/flood.svg";
import rescueSvg from "../../assets/images/flood2.svg";
import EnvironmentFloodingLayers from "../../assets/EnvironmentFloodingLayers";
import { ChevronDown, ChevronUp } from "lucide-react";

const Flood = () => {
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
			<EnvironmentFloodingLayers>
				<main className="container mx-auto py-12 px-4">
					<div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 max-w-4xl mx-auto border border-blue-300/40 space-y-10">
						<header className="text-center">
							<h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-4">
								Floods
							</h1>
							<p className="text-lg md:text-xl text-gray-700">
								A deep dive into one of the most common and devastating natural
								disasters worldwide.
							</p>
						</header>

						<img
							src={floodImage}
							alt="Flooded street"
							className="rounded-xl w-full h-64 object-cover shadow-md border border-blue-200"
						/>

						<section className="grid md:grid-cols-2 gap-6 items-center">
							<div>
								<h2 className="text-2xl font-semibold text-blue-700 mb-2">
									What is Flooding?
								</h2>
								<p className="text-gray-800 text-lg">
									Flooding occurs when water overflows onto normally dry land.
									It can result from heavy rainfall, storm surges, dam failures,
									or overflowing rivers and lakes.
								</p>
							</div>
							<img
								src={floodSvg}
								alt="Flood illustration"
								className="w-full max-h-64 object-contain"
							/>
						</section>

						<section>
							<h2 className="text-2xl font-semibold text-blue-700 mb-4">
								Causes of Flooding
							</h2>
							<div className="grid sm:grid-cols-2 gap-4 text-gray-800 text-lg">
								<div className="bg-blue-100 p-4 rounded-lg shadow-sm">
									🌧️ Intense rainfall
								</div>
								<div className="bg-blue-100 p-4 rounded-lg shadow-sm">
									🌊 Coastal storm surges
								</div>
								<div className="bg-blue-100 p-4 rounded-lg shadow-sm">
									🌿 Deforestation and land use change
								</div>
								<div className="bg-blue-100 p-4 rounded-lg shadow-sm">
									🏞️ River overflow
								</div>
								<div className="bg-blue-100 p-4 rounded-lg shadow-sm">
									🏗️ Poor drainage in urban areas
								</div>
							</div>
						</section>

						<section>
							<h2 className="text-2xl font-semibold text-blue-700 mb-4">
								Effects of Flooding
							</h2>
							<ul className="list-disc pl-6 text-gray-800 text-lg space-y-2">
								<li>Loss of life and displacement of communities</li>
								<li>Damage to infrastructure and homes</li>
								<li>Contaminated water and disease outbreaks</li>
								<li>Agricultural loss and food insecurity</li>
								<li>Long-term economic impact</li>
							</ul>
						</section>

						<section className="grid md:grid-cols-2 gap-6 items-center">
							<img
								src={rescueSvg}
								alt="Rescue illustration"
								className="w-full max-h-64 object-contain"
							/>
							<div>
								<h2 className="text-2xl font-semibold text-blue-700 mb-2">
									Solutions to Flooding
								</h2>
								<ul className="list-disc pl-6 text-gray-800 text-lg space-y-2">
									<li>Building flood barriers and levees</li>
									<li>Improving drainage and infrastructure</li>
									<li>Preserving wetlands and green spaces</li>
									<li>Community awareness and early warning systems</li>
									<li>Emergency response planning and training</li>
								</ul>
							</div>
						</section>

						<section>
							<h2 className="text-2xl font-semibold text-blue-700 mb-4">
								What to Do During a Flood
							</h2>
							<ul className="list-disc pl-6 text-gray-800 text-lg space-y-2">
								<li>Move to higher ground immediately</li>
								<li>Avoid walking or driving through floodwaters</li>
								<li>
									Disconnect electrical appliances and avoid contact with
									electricity
								</li>
								<li>
									Keep an emergency kit with essentials like water, food,
									flashlight, and first-aid
								</li>
								<li>
									Stay informed through official alerts and radio broadcasts
								</li>
								<li>
									If trapped, signal for help with a flashlight or brightly
									colored cloth
								</li>
							</ul>
						</section>

						{/* Case Study Section */}
						<section className="border border-blue-200 rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 to-white">
							<div
								className="flex items-center justify-between p-4 cursor-pointer"
								onClick={toggleCaseStudy}
							>
								<h2 className="text-2xl font-semibold text-blue-700">
									Case Study: The 2023 Midwest Floods
								</h2>
								<button
									className="bg-blue-100 hover:bg-blue-200 text-blue-800 p-2 rounded-full transition-all duration-300"
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
									<div className="bg-white rounded-lg p-4 shadow-sm border border-blue-100">
										<h3 className="text-lg font-medium text-blue-700 mb-2">
											The Event
										</h3>
										<p className="text-gray-700">
											In April 2023, unprecedented rainfall caused major rivers
											across the Midwest to overflow, affecting five states and
											resulting in one of the costliest flood events in recent
											history.
										</p>
									</div>
									<div className="bg-white rounded-lg p-4 shadow-sm border border-blue-100">
										<h3 className="text-lg font-medium text-blue-700 mb-2">
											The Impact
										</h3>
										<p className="text-gray-700">
											Over 50,000 homes damaged, 12 lives lost, and $3.8 billion
											in economic losses. Agricultural impacts included 400,000
											acres of farmland submerged just before planting season.
										</p>
									</div>
									<div className="bg-white rounded-lg p-4 shadow-sm border border-blue-100">
										<h3 className="text-lg font-medium text-blue-700 mb-2">
											The Response
										</h3>
										<p className="text-gray-700">
											Emergency services evacuated 15,000 residents. Community
											volunteers filled 1.2 million sandbags. FEMA provided $225
											million in immediate assistance to affected communities.
										</p>
									</div>
								</div>

								<div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-6">
									<h3 className="text-xl font-medium text-blue-800 mb-3">
										Key Lessons Learned
									</h3>
									<ul className="grid md:grid-cols-2 gap-4">
										<li className="flex items-start">
											<div className="text-blue-500 font-bold mr-2">1.</div>
											<p className="text-gray-700">
												Early warning systems saved lives but needed better
												coordination between agencies
											</p>
										</li>
										<li className="flex items-start">
											<div className="text-blue-500 font-bold mr-2">2.</div>
											<p className="text-gray-700">
												Communities with restored wetlands experienced 40% less
												damage than similar areas without them
											</p>
										</li>
										<li className="flex items-start">
											<div className="text-blue-500 font-bold mr-2">3.</div>
											<p className="text-gray-700">
												Modern building codes proved effective, with new
												structures suffering 65% less damage
											</p>
										</li>
										<li className="flex items-start">
											<div className="text-blue-500 font-bold mr-2">4.</div>
											<p className="text-gray-700">
												Digital emergency communication reached 93% of
												residents, compared to 67% through traditional means
											</p>
										</li>
									</ul>
								</div>

								<div
									className="cursor-pointer flex items-center justify-between p-4 mt-4 bg-blue-100 rounded-lg border border-blue-300"
									onClick={toggleMoreStudies}
								>
									<h3 className="text-lg font-medium text-blue-700">
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
											<b>Hurricane Sandy (2012):</b> Urban flooding in New York City led to major infrastructure upgrades and coastal resilience planning.
										</li>
										<li>
											<b>Bangkok Floods (2011):</b> How Thailand's capital adapted its urban planning after devastating monsoon flooding.
										</li>
										<li>
											<b>Netherlands' Room for the River Program:</b> An innovative approach to flood management by deliberately creating overflow areas.
										</li>
										<li>
											<b>Queensland Floods (2010-2011):</b> Australia's development of community resilience programs and early warning systems.
										</li>
									</ul>
								</div>
							</div>
						</section>

						<footer className="text-center mt-8">
							<p className="text-blue-800 text-lg">
								🌧️ Preparedness and prevention are the keys to resilience.
							</p>
						</footer>
					</div>
				</main>
			</EnvironmentFloodingLayers>
		</div>
	);
};

export default Flood;