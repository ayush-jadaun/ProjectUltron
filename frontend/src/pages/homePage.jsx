import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
	MapPinIcon,
	BellIcon,
	LeafIcon,
	AlertTriangleIcon,
	DropletIcon,
	ThermometerIcon,
	FlameIcon,
} from "lucide-react";
import EnvironmentBackgroundLayers from "../assets/EnvironmentBackgroundLayers";

const HomePage = () => {
	const { isAuthenticated } = useSelector((state) => state.auth);
	const navigate = useNavigate();

	// Navigation handlers
	const handleGetStarted = () => {
		navigate(isAuthenticated ? "/preferences" : "/signup");
	};

	const handleLogin = () => {
		navigate("/login");
	};

	return (
		<div className="min-h-screen">
			<EnvironmentBackgroundLayers>
				<main className="container mx-auto py-12 px-4">
					{/* Hero Section - Made more compact */}
					<div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6 max-w-4xl mx-auto border border-gray-200/50 mb-8">
						<h1 className="text-3xl md:text-4xl font-bold text-green-700 mb-4">
							Take Action for Our Planet
						</h1>
						<p className="text-lg text-gray-600 mb-6 max-w-2xl">
							EcoAlert helps you stay informed about environmental changes in
							regions you care about. Get timely notifications about
							deforestation, flooding, air pollution, and other ecological
							issues before irreversible damage occurs.
						</p>
						<div className="flex flex-wrap gap-3">
							{!isAuthenticated && (
								<button
									onClick={handleLogin}
									className="px-6 py-2 bg-white hover:bg-gray-50 text-green-600 font-medium rounded-md shadow-sm transition-all duration-150 border border-green-500"
								>
									Already a member? Sign in
								</button>
							)}
							{isAuthenticated && (
								<button
									onClick={navigate("/map")}
									className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md shadow-sm transition-all duration-150 flex items-center"
								>
									<BellIcon className="mr-2" size={18} />
									Get Started
								</button>
							)}
						</div>
					</div>

					{/* Our Mission Section - More compact */}
					<section className="mb-10">
						<h2 className="text-2xl font-bold text-center text-green-700 mb-8">
							Our Mission
						</h2>
						<div className="grid md:grid-cols-2 gap-6 items-center">
							<div className="bg-white/70 backdrop-blur-sm p-5 rounded-lg shadow-sm">
								<h3 className="text-xl font-semibold text-green-600 mb-3">
									Timely Information Saves Ecosystems
								</h3>
								<p className="text-gray-600 mb-3 text-sm">
									Environmental degradation often happens gradually, making it
									difficult to notice until significant damage has occurred. Our
									alert system monitors environmental changes in real-time using
									satellite data and on-ground sensors.
								</p>
								<p className="text-gray-600 text-sm">
									By providing early warnings about deforestation, flooding,
									glacier melting, and air pollution, we empower communities,
									conservationists, and authorities to take preventive action
									before permanent damage occurs.
								</p>
							</div>
							<div className="h-56 border rounded-lg overflow-hidden bg-gray-100/50 backdrop-blur-sm shadow-inner">
								<iframe
									src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15283674.799797209!2d72.09858950579333!3d20.73595779415586!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30635ff06b92b791%3A0xd78c4fa1854213a6!2sIndia!5e0!3m2!1sen!2sin!4v1745021275104!5m2!1sen!2sin"
									width="100%"
									height="100%"
									allowFullScreen=""
									loading="lazy"
									referrerPolicy="no-referrer-when-downgrade"
								></iframe>
							</div>
						</div>
					</section>

					{/* Key Focus Areas - Smaller cards */}
					<section className="mb-10">
						<h2 className="text-2xl font-bold text-center text-green-700 mb-8">
							Key Focus Areas
						</h2>
						<div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
							{/* Deforestation */}
							<div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg shadow-sm flex flex-col items-center text-center">
								<div className="rounded-full bg-green-50 p-3 mb-3">
									<LeafIcon size={24} className="text-green-500" />
								</div>
								<h3 className="text-lg font-semibold text-green-600 mb-2">
									Deforestation Prevention
								</h3>
								<p className="text-gray-600 text-sm">
									Detect early signs of illegal logging, land clearing, and
									forest fires to protect our critical forest ecosystems.
								</p>
							</div>

							{/* Flooding */}
							<div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg shadow-sm flex flex-col items-center text-center">
								<div className="rounded-full bg-blue-50 p-3 mb-3">
									<DropletIcon size={24} className="text-blue-500" />
								</div>
								<h3 className="text-lg font-semibold text-blue-600 mb-2">
									Flood Management
								</h3>
								<p className="text-gray-600 text-sm">
									Early flood warnings help communities evacuate and authorities
									implement preventive measures before devastating floods occur.
								</p>
							</div>

							{/*Coastal*/}
							<div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg shadow-sm flex flex-col items-center text-center">
								<div className="rounded-full bg-gray-50 p-3 mb-3">
									<AlertTriangleIcon size={24} className="text-gray-500" />
								</div>
								<h3 className="text-lg font-semibold text-gray-600 mb-2">
									Coastal Erosion
								</h3>
								<p className="text-gray-600 text-sm">
									Monitor dangerous levels of coastal erosion for public safety
									and identify sources requiring immediate intervention by the
									authorities.
								</p>
							</div>
							<div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg shadow-sm flex flex-col items-center text-center">
								<div className="rounded-full bg-red-50 p-3 mb-3">
									<FlameIcon size={24} className="text-red-500" />
								</div>
								<h3 className="text-lg font-semibold text-red-600 mb-2">
									Wildfire Prevention
								</h3>
								<p className="text-gray-600 text-sm">
									Monitor high-risk areas and implement early warning systems to
									protect communities and preserve natural habitats from
									devastating wildfires.
								</p>
							</div>
							{/* Glacier Melting */}
							<div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg shadow-sm flex flex-col items-center text-center">
								<div className="rounded-full bg-cyan-50 p-3 mb-3">
									<ThermometerIcon size={24} className="text-cyan-500" />
								</div>
								<h3 className="text-lg font-semibold text-cyan-600 mb-2">
									Glacier Protection
								</h3>
								<p className="text-gray-600 text-sm">
									Track accelerated glacier melting to understand climate change
									impacts and help communities prepare for changing water
									supplies.
								</p>
							</div>
						</div>
					</section>

					{/* Call to Action - More compact */}
					<section className="bg-green-200/1000 backdrop-blur-sm text-white rounded-lg shadow-md p-6 text-center">
						<h2 className="text-2xl font-bold mb-4">
							Join Our Environmental Alert Network
						</h2>
						<p className="text-base mb-6 max-w-2xl mx-auto">
							Subscribe to receive timely alerts about environmental changes in
							regions you care about. Together, we can protect our planet for
							future generations.
						</p>
						<button
							onClick={handleGetStarted}
							className="px-6 py-2 bg-white hover:bg-gray-50 text-green-600 font-medium rounded-md shadow-sm transition-all duration-150"
						>
							Set Up Your Alerts Today
						</button>
					</section>
				</main>
			</EnvironmentBackgroundLayers>
		</div>
	);
};

export default HomePage;
