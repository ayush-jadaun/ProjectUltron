import React from "react";
import floodImage from "../../assets/images/floodingtop.jpg";
import floodSvg from "../../assets/images/flood.svg";
import rescueSvg from "../../assets/images/flood2.svg";
import EnvironmentFloodingLayers from "../../assets/EnvironmentFloodingLayers";

const Flood = () => {
	return (
		<div className="min-h-screen">
			<EnvironmentFloodingLayers>
				<main className="container mx-auto py-12 px-4">
					<div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 max-w-4xl mx-auto border border-blue-300/40 space-y-10">
						<header className="text-center">
							<h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-4">Floods</h1>
							<p className="text-lg md:text-xl text-gray-700">
								A deep dive into one of the most common and devastating natural disasters worldwide.
							</p>
						</header>

						<img
							src={floodImage}
							alt="Flooded street"
							className="rounded-xl w-full h-64 object-cover shadow-md border border-blue-200"
						/>

						<section className="grid md:grid-cols-2 gap-6 items-center">
							<div>
								<h2 className="text-2xl font-semibold text-blue-700 mb-2">What is Flooding?</h2>
								<p className="text-gray-800 text-lg">
									Flooding occurs when water overflows onto normally dry land. It can result from heavy rainfall,
									storm surges, dam failures, or overflowing rivers and lakes.
								</p>
							</div>
							<img src={floodSvg} alt="Flood illustration" className="w-full max-h-64 object-contain" />
						</section>

						<section>
							<h2 className="text-2xl font-semibold text-blue-700 mb-4">Causes of Flooding</h2>
							<div className="grid sm:grid-cols-2 gap-4 text-gray-800 text-lg">
								<div className="bg-blue-100 p-4 rounded-lg shadow-sm">🌧️ Intense rainfall</div>
								<div className="bg-blue-100 p-4 rounded-lg shadow-sm">🌊 Coastal storm surges</div>
								<div className="bg-blue-100 p-4 rounded-lg shadow-sm">🌿 Deforestation and land use change</div>
								<div className="bg-blue-100 p-4 rounded-lg shadow-sm">🏞️ River overflow</div>
								<div className="bg-blue-100 p-4 rounded-lg shadow-sm">🏗️ Poor drainage in urban areas</div>
							</div>
						</section>

						<section>
							<h2 className="text-2xl font-semibold text-blue-700 mb-4">Effects of Flooding</h2>
							<ul className="list-disc pl-6 text-gray-800 text-lg space-y-2">
								<li>Loss of life and displacement of communities</li>
								<li>Damage to infrastructure and homes</li>
								<li>Contaminated water and disease outbreaks</li>
								<li>Agricultural loss and food insecurity</li>
								<li>Long-term economic impact</li>
							</ul>
						</section>

						<section className="grid md:grid-cols-2 gap-6 items-center">
							<img src={rescueSvg} alt="Rescue illustration" className="w-full max-h-64 object-contain" />
							<div>
								<h2 className="text-2xl font-semibold text-blue-700 mb-2">Solutions to Flooding</h2>
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
							<h2 className="text-2xl font-semibold text-blue-700 mb-4">What to Do During a Flood</h2>
							<ul className="list-disc pl-6 text-gray-800 text-lg space-y-2">
								<li>Move to higher ground immediately</li>
								<li>Avoid walking or driving through floodwaters</li>
								<li>Disconnect electrical appliances and avoid contact with electricity</li>
								<li>Keep an emergency kit with essentials like water, food, flashlight, and first-aid</li>
								<li>Stay informed through official alerts and radio broadcasts</li>
								<li>If trapped, signal for help with a flashlight or brightly colored cloth</li>
							</ul>
						</section>

						<footer className="text-center mt-8">
							<p className="text-blue-800 text-lg mb-4">
								🌧️ Preparedness and prevention are the keys to resilience.
							</p>
							<button className="bg-blue-700 hover:bg-blue-800 text-white py-2 px-6 rounded-xl shadow-md transition">
								Learn More
							</button>
						</footer>
					</div>
				</main>
			</EnvironmentFloodingLayers>
		</div>
	);
};

export default Flood;
