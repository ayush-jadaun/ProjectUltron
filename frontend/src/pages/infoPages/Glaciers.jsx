import React from "react";
import glacierImage from "../../assets/images/iceberg.jpg";
import meltingSvg from "../../assets/images/glacier-svgrepo-com.svg";
import solutionSvg from "../../assets/images/polar-svgrepo-com.svg";
import EnvironmentIcebergLayers from "../../assets/EnvironmentIcebergLayers";

const Glaciers = () => {
	return (
		<div className="min-h-screen">
			<EnvironmentIcebergLayers>
				<main className="container mx-auto py-12 px-4">
					<div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 max-w-4xl mx-auto border border-blue-200/40 space-y-10">
						<header className="text-center">
							<h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">Melting of Glaciers & Icebergs</h1>
							<p className="text-lg md:text-xl text-gray-700">
								Exploring the chilling truth behind climate-driven glacial retreat and its global effects.
							</p>
						</header>

						<img
							src={glacierImage}
							alt="Melting glacier"
							className="rounded-xl w-full h-64 object-cover shadow-md border border-blue-100"
						/>

						<section className="grid md:grid-cols-2 gap-6 items-center">
							<div>
								<h2 className="text-2xl font-semibold text-blue-800 mb-2">What is Glacial Melting?</h2>
								<p className="text-gray-800 text-lg">
									Glacial melting refers to the shrinking and thinning of ice masses and icebergs, primarily
									driven by rising global temperatures. These frozen giants are losing mass at alarming rates,
									contributing significantly to sea level rise.
								</p>
							</div>
							<img src={meltingSvg} alt="Melting illustration" className="w-full max-h-64 object-contain" />
						</section>

						<section>
							<h2 className="text-2xl font-semibold text-blue-800 mb-4">Causes of Glacial Melting</h2>
							<div className="grid sm:grid-cols-2 gap-4 text-gray-800 text-lg">
								<div className="bg-blue-100 p-4 rounded-lg shadow-sm">🔥 Global warming</div>
								<div className="bg-blue-100 p-4 rounded-lg shadow-sm">🌫️ Atmospheric pollution</div>
								<div className="bg-blue-100 p-4 rounded-lg shadow-sm">🚗 Greenhouse gas emissions</div>
								<div className="bg-blue-100 p-4 rounded-lg shadow-sm">🌪️ Changing ocean currents</div>
								<div className="bg-blue-100 p-4 rounded-lg shadow-sm">🏭 Industrial development near polar zones</div>
							</div>
						</section>

						<section>
							<h2 className="text-2xl font-semibold text-blue-800 mb-4">Effects of Melting Glaciers</h2>
							<ul className="list-disc pl-6 text-gray-800 text-lg space-y-2">
								<li>Rising global sea levels, threatening coastal cities</li>
								<li>Loss of habitats for polar and alpine species</li>
								<li>Disruption of freshwater sources for millions</li>
								<li>Changes in ocean salinity and currents</li>
								<li>Increased frequency of natural disasters like floods</li>
							</ul>
						</section>

						<section className="grid md:grid-cols-2 gap-6 items-center">
							<img src={solutionSvg} alt="Solutions to glacier melting" className="w-full max-h-64 object-contain" />
							<div>
								<h2 className="text-2xl font-semibold text-blue-800 mb-2">Solutions and Actions</h2>
								<ul className="list-disc pl-6 text-gray-800 text-lg space-y-2">
									<li>Switching to renewable energy sources</li>
									<li>Reducing greenhouse gas emissions globally</li>
									<li>Reforestation and afforestation programs</li>
									<li>Support for climate agreements and regulations</li>
									<li>Research and monitoring of polar regions</li>
								</ul>
							</div>
						</section>

						<section>
							<h2 className="text-2xl font-semibold text-blue-800 mb-4">What Can You Do?</h2>
							<ul className="list-disc pl-6 text-gray-800 text-lg space-y-2">
								<li>Reduce your carbon footprint through conscious travel and consumption</li>
								<li>Use energy-efficient appliances and support clean energy</li>
								<li>Educate others about climate change and its impacts</li>
								<li>Support conservation organizations and clean policies</li>
								<li>Stay informed and vote for climate-positive leadership</li>
							</ul>
						</section>

						<footer className="text-center mt-8">
							<p className="text-blue-800 text-lg mb-4">
								❄️ Together, we can slow the melt and preserve Earth’s frozen wonders.
							</p>
							<button className="bg-blue-700 hover:bg-blue-800 text-white py-2 px-6 rounded-xl shadow-md transition">
								Explore More
							</button>
						</footer>
					</div>
				</main>
			</EnvironmentIcebergLayers>
		</div>
	);
};

export default Glaciers;
