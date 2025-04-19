import React, { useState } from "react";
import EnvironmentBackgroundLayers from "../../assets/EnvironmentBackgroundLayers";
import forestImage from "../../assets/images/forest.webp";
import deforestationSvg from "../../assets/images/deforestation.svg";
import solutionSvg from "../../assets/images/deforrestation (1).svg";
import { ChevronDown, ChevronUp } from "lucide-react";

const GreenIndex = () => {
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
			<EnvironmentBackgroundLayers>
				<main className="container mx-auto py-12 px-4">
					<div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 max-w-4xl mx-auto border border-green-300/40 space-y-10">
						<header className="text-center">
							<h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
								Deforestation
							</h1>
							<p className="text-lg md:text-xl text-brown-800">
								Understanding the causes, consequences, and solutions to one of
								nature's biggest threats.
							</p>
						</header>

						<img
							src={forestImage}
							alt="Lush forest"
							className="rounded-xl w-full h-64 object-cover shadow-md border border-green-200"
						/>

						<section className="grid md:grid-cols-2 gap-6 items-center">
							<div>
								<h2 className="text-2xl font-semibold text-green-700 mb-2">
									What is Deforestation?
								</h2>
								<p className="text-brown-900 text-lg">
									Deforestation refers to the clearing or thinning of forests by
									humans. It has widespread impacts on biodiversity, climate,
									and local communities.
								</p>
							</div>
							<img
								src={deforestationSvg}
								alt="Deforestation illustration"
								className="w-full max-h-64 object-contain"
							/>
						</section>

						<section>
							<h2 className="text-2xl font-semibold text-green-700 mb-4">
								Causes of Deforestation
							</h2>
							<div className="grid sm:grid-cols-2 gap-4 text-brown-800 text-lg">
								<div className="bg-green-100 p-4 rounded-lg shadow-sm">
									🌾 Agricultural expansion
								</div>
								<div className="bg-green-100 p-4 rounded-lg shadow-sm">
									🪓 Logging for timber
								</div>
								<div className="bg-green-100 p-4 rounded-lg shadow-sm">
									🏗️ Urban development
								</div>
								<div className="bg-green-100 p-4 rounded-lg shadow-sm">
									⛏️ Mining operations
								</div>
								<div className="bg-green-100 p-4 rounded-lg shadow-sm">
									🔥 Wildfires (natural & human)
								</div>
							</div>
						</section>

						<section>
							<h2 className="text-2xl font-semibold text-green-700 mb-4">
								Effects of Deforestation
							</h2>
							<ul className="list-disc pl-6 text-brown-900 text-lg space-y-2">
								<li>Loss of plant and animal biodiversity</li>
								<li>Soil erosion and land degradation</li>
								<li>Increased greenhouse gas emissions</li>
								<li>Altered rainfall and weather patterns</li>
								<li>Displacement of forest-dependent communities</li>
							</ul>
						</section>

						<section className="grid md:grid-cols-2 gap-6 items-center">
							<img
								src={solutionSvg}
								alt="Solution illustration"
								className="w-full max-h-64 object-contain"
							/>
							<div>
								<h2 className="text-2xl font-semibold text-green-700 mb-2">
									Solutions to Deforestation
								</h2>
								<ul className="list-disc pl-6 text-brown-800 text-lg space-y-2">
									<li>Reforestation and afforestation projects</li>
									<li>Enforcing forest protection laws</li>
									<li>Sustainable logging and farming</li>
									<li>Eco-conscious consumer behavior</li>
									<li>Supporting indigenous rights and knowledge</li>
								</ul>
							</div>
						</section>

						<section>
							<h2 className="text-2xl font-semibold text-green-700 mb-4">
								What Can You Do?
							</h2>
							<ul className="list-disc pl-6 text-brown-900 text-lg space-y-2">
								<li>Reduce paper usage and recycle consistently</li>
								<li>Choose sustainably sourced wood and products</li>
								<li>
									Plant trees in your community or support reforestation
									projects
								</li>
								<li>Raise awareness through education and social media</li>
								<li>
									Support businesses that prioritize eco-friendly practices
								</li>
							</ul>
						</section>

						<section className="border border-green-200 rounded-xl overflow-hidden bg-gradient-to-br from-green-50 to-white">
							<div
								className="flex items-center justify-between p-4 cursor-pointer"
								onClick={toggleCaseStudy}
							>
								<h2 className="text-2xl font-semibold text-green-700">
									Case Study: Amazon Rainforest Conservation Efforts
								</h2>
								<button
									className="bg-green-100 hover:bg-green-200 text-green-800 p-2 rounded-full transition-all duration-300"
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
									<div className="bg-white rounded-lg p-4 shadow-sm border border-green-100">
										<h3 className="text-lg font-medium text-green-700 mb-2">
											The Challenge
										</h3>
										<p className="text-gray-700">
											The Amazon rainforest loses approximately 10,000 square
											kilometers annually - equivalent to about 40 football
											fields every minute. Since 1978, over 750,000 km² has been
											deforested, primarily for cattle ranching and soy
											production.
										</p>
									</div>
									<div className="bg-white rounded-lg p-4 shadow-sm border border-green-100">
										<h3 className="text-lg font-medium text-green-700 mb-2">
											The Initiative
										</h3>
										<p className="text-gray-700">
											The Terra Verde Project launched in 2018 combines
											satellite monitoring, indigenous partnerships, and
											sustainable economic alternatives. It operates in five
											critical regions covering over 50,000 km² of threatened
											forest.
										</p>
									</div>
									<div className="bg-white rounded-lg p-4 shadow-sm border border-green-100">
										<h3 className="text-lg font-medium text-green-700 mb-2">
											The Results
										</h3>
										<p className="text-gray-700">
											Areas under the program have seen a 47% reduction in
											deforestation rates. Over 2,000 indigenous rangers have
											been trained, 15 million trees planted, and 12,000
											hectares of degraded land restored to productivity.
										</p>
									</div>
								</div>

								<div className="bg-green-50 p-6 rounded-lg border border-green-200 mb-6">
									<h3 className="text-xl font-medium text-green-800 mb-3">
										Key Success Factors
									</h3>
									<ul className="grid md:grid-cols-2 gap-4">
										<li className="flex items-start">
											<div className="text-green-600 font-bold mr-2">1.</div>
											<p className="text-gray-700">
												Indigenous-led conservation based on traditional
												knowledge systems
											</p>
										</li>
										<li className="flex items-start">
											<div className="text-green-600 font-bold mr-2">2.</div>
											<p className="text-gray-700">
												Market-based initiatives creating profitable
												alternatives to deforestation
											</p>
										</li>
										<li className="flex items-start">
											<div className="text-green-600 font-bold mr-2">3.</div>
											<p className="text-gray-700">
												Advanced monitoring technology with AI-enabled early
												warning systems
											</p>
										</li>
										<li className="flex items-start">
											<div className="text-green-600 font-bold mr-2">4.</div>
											<p className="text-gray-700">
												Integrated policy approach involving governments, NGOs,
												and local communities
											</p>
										</li>
									</ul>
								</div>

								<div
									className="cursor-pointer flex items-center justify-between p-4 mt-4 bg-green-100 rounded-lg border border-green-300"
									onClick={toggleMoreStudies}
								>
									<h3 className="text-lg font-medium text-green-800">
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
											<b>Indonesia’s REDD+ Program:</b> Using carbon credit systems
											to fund forest protection and reduce illegal logging.
										</li>
										<li>
											<b>Kenya's Green Belt Movement:</b> Grassroots community
											reforestation led by women to restore degraded lands.
										</li>
										<li>
											<b>Peru’s Indigenous Land Rights Law:</b> Legal recognition of
											native territories that curbed commercial exploitation.
										</li>
										<li>
											<b>India’s Joint Forest Management:</b> Collaborative approach
											between local communities and forestry departments.
										</li>
									</ul>
								</div>
							</div>
						</section>

						<footer className="text-center mt-8">
							<p className="text-green-800 text-lg mb-4">
								🌍 Every small action counts — let's protect our forests
								together.
							</p>
						</footer>
					</div>
				</main>
			</EnvironmentBackgroundLayers>
		</div>
	);
};

export default GreenIndex;
