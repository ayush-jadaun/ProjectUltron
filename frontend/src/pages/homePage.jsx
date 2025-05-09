import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
	MapPinIcon,
	BellIcon,
	LeafIcon,
	AlertTriangleIcon,
	DropletIcon,
	ThermometerIcon,
	FlameIcon,
	ArrowRightIcon,
} from "lucide-react";
import EnvironmentBackgroundLayers from "../assets/EnvironmentBackgroundLayers";

const HomePage = () => {
	const { isAuthenticated } = useSelector((state) => state.auth);
	const navigate = useNavigate();
	const [coinCount, setCoinCount] = useState(0);
	const [coinActive, setCoinActive] = useState(false);
	const audioRef = useRef(null);

	// Navigation handlers
	const handleGetStarted = () => {
		navigate(isAuthenticated ? "/map" : "/signup");
	};

	const handleLogin = () => {
		navigate("/login");
	};

	// Mario coin handler
	const handleCoinClick = () => {
		// Play coin sound

		if (audioRef.current) {
			audioRef.current.currentTime = 0; // Reset audio to start
			audioRef.current.play().catch((error) => {
				console.error("Error playing sound:", error);
			});
		} else {
			console.error("Audio element not found");
		}
		// Animate coin
		setCoinActive(true);
		setTimeout(() => setCoinActive(false), 500);

		// Increment coin count
		setCoinCount((prevCount) => prevCount + 1);
		setTimeout(() => navigate("/satellite"), 1200);
	};

	// Animation variants
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.2,
			},
		},
	};

	const itemVariants = {
		hidden: { y: 20, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1,
			transition: {
				duration: 0.5,
			},
		},
	};

	return (
		<motion.div
			initial="hidden"
			animate="visible"
			variants={containerVariants}
			className="min-h-screen"
		>
			<EnvironmentBackgroundLayers>
				<main className="container mx-auto py-12 px-4 max-w-3xl">
					{/* Hero Section */}
					<motion.div
						variants={itemVariants}
						className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-8 mb-12 border border-gray-200/50 relative overflow-hidden"
					>
						<div className="relative z-10">
							<motion.h1
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6 }}
								className="text-4xl font-bold mb-6 bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent"
							>
								Take Action for Our Planet
							</motion.h1>
							<motion.p
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: 0.2 }}
								className="text-lg text-gray-600 mb-8 leading-relaxed"
							>
								helps you stay informed about environmental changes in regions
								you care about. Get timely notifications about deforestation,
								flooding, air pollution, and other ecological issues.
							</motion.p>
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: 0.4 }}
								className="flex flex-col sm:flex-row gap-4"
							>
								<motion.button
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									onClick={handleGetStarted}
									className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-md transition-all duration-300 flex items-center justify-center gap-2 group"
								>
									<MapPinIcon size={20} />
									Get Notifications
									<ArrowRightIcon
										size={20}
										className="group-hover:translate-x-1 transition-transform"
									/>
								</motion.button>
								{!isAuthenticated && (
									<motion.button
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										onClick={handleLogin}
										className="px-8 py-3 bg-white hover:bg-gray-50 text-green-600 font-medium rounded-lg shadow-md transition-all duration-300 border-2 border-green-500 flex items-center justify-center gap-2 group"
									>
										<BellIcon size={20} />
										Sign in
									</motion.button>
								)}
							</motion.div>
						</div>
					</motion.div>

					{/* Mario Coin Button */}
					<div className="flex flex-col items-center mb-8">
						<motion.div
							className="relative mb-2"
							initial={{ y: 0 }}
							animate={
								coinActive ? { y: -20, opacity: [1, 0] } : { y: 0, opacity: 1 }
							}
							transition={{ duration: 0.5 }}
						>
							<motion.button
								onClick={handleCoinClick}
								whileHover={{ scale: 1.1, rotate: [0, 5, -5, 0] }}
								whileTap={{ scale: 0.9 }}
								className="w-16 h-16 rounded-full bg-yellow-400 border-4 border-yellow-500 shadow-lg flex items-center justify-center relative overflow-hidden"
							>
								<div className="absolute inset-0 bg-gradient-to-b from-yellow-300 to-yellow-500 opacity-70" />
								<div className="relative z-10 font-bold text-yellow-800 text-sm">
									?
								</div>
							</motion.button>
						</motion.div>
						{coinCount > 0 && (
							<div className="text-yellow-600 font-bold flex items-center">
								<span className="mr-1">×</span> {coinCount}
							</div>
						)}
						<audio ref={audioRef} className="hidden">
							<source
								src="https://themushroomkingdom.net/sounds/wav/smw/smw_coin.wav"
								type="audio/wav"
							/>
						</audio>
					</div>

					{/* Focus Areas Section */}
					<motion.section variants={itemVariants} className="mb-12">
						<motion.h2
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}
							className="text-2xl font-bold text-center text-green-700 mb-8"
						>
							Key Environmental Focus Areas
						</motion.h2>

						<div className="grid grid-cols-1 md:grid-cols-5 gap-2">
							{/* Deforestation */}
							<motion.div
								variants={itemVariants}
								whileHover={{ y: -3 }}
								className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-md border border-gray-200/50 flex flex-col items-center justify-center text-center hover:shadow-lg transition-all duration-300"
							>
								<div
									className="rounded-full bg-green-50 p-4 mb-2"
									onClick={() => {
										navigate("/green");
									}}
								>
									<LeafIcon size={20} className="text-green-500" />
								</div>
								<h3 className="text-sm md:text-xl font-semibold text-green-600">
									Deforestation
								</h3>
							</motion.div>

							{/* Flooding */}
							<motion.div
								variants={itemVariants}
								whileHover={{ y: -3 }}
								className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-md border border-gray-200/50 flex flex-col items-center justify-center text-center hover:shadow-lg transition-all duration-300"
							>
								<div
									className="rounded-full bg-blue-50 p-4 mb-2"
									onClick={() => {
										navigate("/flood");
									}}
								>
									<DropletIcon size={20} className="text-blue-500" />
								</div>
								<h3 className="text-sm md:text-xl font-semibold text-blue-600">
									Floods
								</h3>
							</motion.div>

							{/* Coastal */}
							<motion.div
								variants={itemVariants}
								whileHover={{ y: -3 }}
								className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-md border border-gray-200/50 flex flex-col items-center justify-center text-center hover:shadow-lg transition-all duration-300"
							>
								<div
									className="rounded-full bg-gray-50 p-4 mb-2"
									onClick={() => {
										navigate("/coast");
									}}
								>
									<AlertTriangleIcon size={20} className="text-gray-500" />
								</div>
								<h3 className="text-sm md:text-xl font-semibold text-gray-600">
									Coastal
								</h3>
							</motion.div>

							{/* Wildfire */}
							<motion.div
								variants={itemVariants}
								whileHover={{ y: -3 }}
								className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-md border border-gray-200/50 flex flex-col items-center justify-center text-center hover:shadow-lg transition-all duration-300"
							>
								<div
									className="rounded-full bg-red-50 p-4 mb-2"
									onClick={() => {
										navigate("/fire");
									}}
								>
									<FlameIcon size={20} className="text-red-500" />
								</div>
								<h3 className="text-sm md:text-xl font-semibold text-red-600">
									Wildfires
								</h3>
							</motion.div>

							{/* Glacier Melting */}
							<motion.div
								variants={itemVariants}
								whileHover={{ y: -3 }}
								className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-md border border-gray-200/50 flex flex-col items-center justify-center text-center hover:shadow-lg transition-all duration-300"
							>
								<div
									className="rounded-full bg-cyan-50 p-4 mb-2"
									onClick={() => {
										navigate("/ice");
									}}
								>
									<ThermometerIcon size={20} className="text-cyan-500" />
								</div>
								<h3 className="text-sm md:text-xl font-semibold text-cyan-600">
									Glaciers
								</h3>
							</motion.div>
						</div>
					</motion.section>
					<motion.section
						variants={itemVariants}
						className="bg-gradient-to-r from-sky-700 via-green-600 to-sky-700 text-white rounded-xl shadow-lg p-8 text-center relative overflow-hidden mb-20"
					>
						<div className="relative z-10">
							<motion.h2
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6 }}
								className="text-2xl font-bold mb-4"
							>
								Statellite Image Comparator
							</motion.h2>
							<motion.p
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6, delay: 0.2 }}
								className="text-lg mb-6"
							>
								Compare satellite images of regions over time to see the impact
								of deforestation, flooding and other environmental changes.
							</motion.p>
						</div>
					</motion.section>
					{/* Call to Action */}
					<motion.section
						variants={itemVariants}
						className="bg-gradient-to-r from-green-800 via-green-600 to-green-800 text-white rounded-xl shadow-lg p-8 text-center relative overflow-hidden"
					>
						<div className="relative z-10">
							<motion.h2
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6 }}
								className="text-2xl font-bold mb-4"
							>
								Join Our Environmental Alert Network
							</motion.h2>
							<motion.p
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6, delay: 0.2 }}
								className="text-lg mb-6"
							>
								Subscribe to receive timely alerts about environmental changes
								in regions you care about.
							</motion.p>
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={handleGetStarted}
								className="px-8 py-3 bg-white hover:bg-gray-50 text-green-600 font-medium rounded-lg shadow-md transition-all duration-300 flex items-center gap-2 group mx-auto"
							>
								Set Up Your Alerts Today
								<ArrowRightIcon
									size={20}
									className="group-hover:translate-x-1 transition-transform"
								/>
							</motion.button>
						</div>
					</motion.section>
				</main>
			</EnvironmentBackgroundLayers>
		</motion.div>
	);
};

export default HomePage;
