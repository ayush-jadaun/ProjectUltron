// src/pages/HomePage.jsx

import React from "react";
import EnvironmentBackgroundLayers from "../../assets/EnvironmentBackgroundLayers";
import forestImage from "../../assets/images/forest.webp";
import deforestationSvg from "../../assets/images/deforestation.svg"; // Add an SVG related to deforestation
import solutionSvg from "../../assets/images/deforrestation (1).svg"; // Optional: Solutions-themed SVG

const GreenIndex = () => {
	return (
		<div className="min-h-screen">
			<EnvironmentBackgroundLayers>
				<main className="container mx-auto py-12 px-4">
					<div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 max-w-4xl mx-auto border border-green-300/40 space-y-10">
						{/* Header */}
						<header className="text-center">
							<h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
								Deforestation
							</h1>
							<p className="text-lg md:text-xl text-brown-800">
								Understanding the causes, consequences, and solutions to one of
								nature’s biggest threats.
							</p>
						</header>

						{/* Hero Image */}
						<img
							src={forestImage}
							alt="Lush forest"
							className="rounded-xl w-full h-64 object-cover shadow-md border border-green-200"
						/>

						{/* What is Deforestation */}
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

						{/* Causes */}
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

						{/* Effects */}
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

						{/* Solutions */}
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

						{/* Call to Action */}
						<footer className="text-center mt-8">
							<p className="text-green-800 text-lg mb-4">
								🌍 Every small action counts — let’s protect our forests
								together.
							</p>
							<button className="bg-green-700 hover:bg-green-800 text-white py-2 px-6 rounded-xl shadow-md transition">
								Take Action
							</button>
						</footer>
					</div>
				</main>
			</EnvironmentBackgroundLayers>
		</div>
	);
};

export default GreenIndex;
