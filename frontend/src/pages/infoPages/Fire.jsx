import React, { useState } from "react";
import FireEnvironmentBackgroundLayers from "../../assets/FireEnvironmentBackgroundLayers";
import wildfireImage from "../../assets/images/wildfire.webp";
import fireSvg from "../../assets/images/wildfire_3043608.png";
import preventionSvg from "../../assets/images/wildfire2.webp";
import { ChevronDown, ChevronUp } from "lucide-react";

const Fire = () => {
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
			<FireEnvironmentBackgroundLayers>
				<main className="container mx-auto py-12 px-4">
					<div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 max-w-4xl mx-auto border border-orange-300/40 space-y-10">
						<header className="text-center">
							<h1 className="text-4xl md:text-5xl font-bold text-orange-800 mb-4">
								Wildfires
							</h1>
							<p className="text-lg md:text-xl text-brown-800">
								Understanding the causes, impacts, and prevention strategies for one of
								nature's most destructive forces.
							</p>
						</header>

						<img
							src={wildfireImage}
							alt="Forest wildfire"
							className="rounded-xl w-full h-64 object-cover shadow-md border border-orange-200"
						/>

						<section className="grid md:grid-cols-2 gap-6 items-center">
							<div>
								<h2 className="text-2xl font-semibold text-orange-700 mb-2">
									What are Wildfires?
								</h2>
								<p className="text-brown-900 text-lg">
									Wildfires are uncontrolled fires that burn in wildland vegetation, often
									in rural areas. They can spread quickly, change direction unexpectedly,
									and can have devastating effects on ecosystems and communities.
								</p>
							</div>
							<img
								src={fireSvg}
								alt="Wildfire illustration"
								className="w-full max-h-64 object-contain"
							/>
						</section>

						<section>
							<h2 className="text-2xl font-semibold text-orange-700 mb-4">
								Causes of Wildfires
							</h2>
							<div className="grid sm:grid-cols-2 gap-4 text-brown-800 text-lg">
								<div className="bg-orange-100 p-4 rounded-lg shadow-sm">
									⚡ Lightning strikes
								</div>
								<div className="bg-orange-100 p-4 rounded-lg shadow-sm">
									🔥 Unattended campfires
								</div>
								<div className="bg-orange-100 p-4 rounded-lg shadow-sm">
									🚬 Discarded cigarettes
								</div>
								<div className="bg-orange-100 p-4 rounded-lg shadow-sm">
									🔌 Equipment malfunctions
								</div>
								<div className="bg-orange-100 p-4 rounded-lg shadow-sm">
									🧨 Intentional arson
								</div>
							</div>
						</section>

						<section>
							<h2 className="text-2xl font-semibold text-orange-700 mb-4">
								Effects of Wildfires
							</h2>
							<ul className="list-disc pl-6 text-brown-900 text-lg space-y-2">
								<li>Destruction of forests and wildlife habitats</li>
								<li>Air quality deterioration and health risks</li>
								<li>Loss of homes and infrastructure</li>
								<li>Long-term ecological damage</li>
								<li>Soil erosion and increased flooding risk</li>
							</ul>
						</section>

						<section className="grid md:grid-cols-2 gap-6 items-center">
							<img
								src={preventionSvg}
								alt="Fire prevention illustration"
								className="w-full max-h-64 object-contain"
							/>
							<div>
								<h2 className="text-2xl font-semibold text-orange-700 mb-2">
									Wildfire Prevention
								</h2>
								<ul className="list-disc pl-6 text-brown-800 text-lg space-y-2">
									<li>Creating defensible space around buildings</li>
									<li>Proper disposal of smoking materials</li>
									<li>Careful management of campfires</li>
									<li>Controlled burns to reduce fuel loads</li>
									<li>Early detection systems and monitoring</li>
								</ul>
							</div>
						</section>

						<section>
							<h2 className="text-2xl font-semibold text-orange-700 mb-4">
								What Can You Do?
							</h2>
							<ul className="list-disc pl-6 text-brown-900 text-lg space-y-2">
								<li>Follow all fire restrictions when outdoors</li>
								<li>Create a family emergency plan for wildfires</li>
								<li>Keep your property clear of dry brush and debris</li>
								<li>Support local firefighting resources</li>
								<li>Learn about fire-resistant landscaping techniques</li>
							</ul>
						</section>

						<section className="border border-orange-200 rounded-xl overflow-hidden bg-gradient-to-br from-orange-50 to-white">
							<div
								className="flex items-center justify-between p-4 cursor-pointer"
								onClick={toggleCaseStudy}
							>
								<h2 className="text-2xl font-semibold text-orange-700">
									Case Study: Australian Bushfire Recovery Efforts
								</h2>
								<button
									className="bg-orange-100 hover:bg-orange-200 text-orange-800 p-2 rounded-full transition-all duration-300"
								>
									{isCaseStudyOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
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
									<div className="bg-white rounded-lg p-4 shadow-sm border border-orange-100">
										<h3 className="text-lg font-medium text-orange-700 mb-2">
											The Disaster
										</h3>
										<p className="text-gray-700">
											The 2019-2020 Australian bushfire season, known as the "Black Summer," 
											burned over 46 million acres, destroyed more than 3,500 homes, and 
											killed or displaced nearly 3 billion animals. It was one of the worst 
											wildfire seasons in Australia's history.
										</p>
									</div>
									<div className="bg-white rounded-lg p-4 shadow-sm border border-orange-100">
										<h3 className="text-lg font-medium text-orange-700 mb-2">
											The Response
										</h3>
										<p className="text-gray-700">
											Project Phoenix was launched in 2020 combining indigenous knowledge, 
											modern technology, and community-led recovery initiatives. The program 
											focused on wildlife rescue, habitat restoration, and building community 
											resilience across affected regions.
										</p>
									</div>
									<div className="bg-white rounded-lg p-4 shadow-sm border border-orange-100">
										<h3 className="text-lg font-medium text-orange-700 mb-2">
											The Results
										</h3>
										<p className="text-gray-700">
											Within three years, the initiative helped establish 24 wildlife corridors, 
											planted over 8 million native trees, rescued and rehabilitated more than 
											60,000 animals, and implemented fire-resistant construction methods in 
											75% of rebuilt homes.
										</p>
									</div>
								</div>

								<div className="bg-orange-50 p-6 rounded-lg border border-orange-200 mb-6">
									<h3 className="text-xl font-medium text-orange-800 mb-3">
										Key Success Factors
									</h3>
									<ul className="grid md:grid-cols-2 gap-4">
										<li className="flex items-start">
											<div className="text-orange-600 font-bold mr-2">1.</div>
											<p className="text-gray-700">
												Integration of Aboriginal fire management practices with modern 
												firefighting techniques
											</p>
										</li>
										<li className="flex items-start">
											<div className="text-orange-600 font-bold mr-2">2.</div>
											<p className="text-gray-700">
												Community-based emergency response networks improving 
												coordination and resilience
											</p>
										</li>
										<li className="flex items-start">
											<div className="text-orange-600 font-bold mr-2">3.</div>
											<p className="text-gray-700">
												Advanced satellite monitoring systems providing early detection 
												and prediction capabilities
											</p>
										</li>
										<li className="flex items-start">
											<div className="text-orange-600 font-bold mr-2">4.</div>
											<p className="text-gray-700">
												Holistic ecosystem recovery approach focusing on biodiversity 
												and natural regeneration processes
											</p>
										</li>
									</ul>
								</div>

								<div
									className="cursor-pointer flex items-center justify-between p-4 mt-4 bg-orange-100 rounded-lg border border-orange-300"
									onClick={toggleMoreStudies}
								>
									<h3 className="text-lg font-medium text-orange-800">
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
											<b>California's Forest Management Revolution:</b> Implementing prescribed 
											burns and mechanical thinning to reduce catastrophic wildfire risk.
										</li>
										<li>
											<b>Portugal's National Fire Prevention Network:</b> Community-based 
											approach creating fire-resistant landscapes and evacuation systems.
										</li>
										<li>
											<b>Canada's FireSmart Program:</b> Educating homeowners and communities 
											about wildfire prevention and property protection strategies.
										</li>
										<li>
											<b>Chile's Drone Detection System:</b> Using advanced technology to 
											identify fire outbreaks in remote areas within minutes of ignition.
										</li>
									</ul>
								</div>
							</div>
						</section>

						<footer className="text-center mt-8">
							<p className="text-orange-800 text-lg mb-4">
								🔥 Prevention is key — together we can reduce wildfire risks and protect our communities.
							</p>
						</footer>
					</div>
				</main>
			</FireEnvironmentBackgroundLayers>
		</div>
	);
};

export default Fire;