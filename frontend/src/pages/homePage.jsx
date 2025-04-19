import React from "react";
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

	// Navigation handlers
	const handleGetStarted = () => {
		navigate(isAuthenticated ? "/preferences" : "/signup");
	};

	const handleLogin = () => {
		navigate("/login");
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

								className="text-4xl md:text-5xl font-bold  mb-6 bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent"

								className="text-4xl font-bold mb-6 bg-gradient-to-r from-green-800 to-blue-500 bg-clip-text text-transparent"

							>
								Take Action for Our Planet
							</motion.h1>
							<motion.p
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: 0.2 }}
								className="text-lg text-gray-600 mb-5 leading-relaxed"
							>
								Project Ultron helps you stay informed about environmental changes in
								regions you care about. Get timely notifications about
								deforestation, flooding, air pollution, and other ecological
								issues.
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
									Get Started
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

						<div className="grid grid-cols-5 gap-2">
							{/* Deforestation */}
							<motion.div
								variants={itemVariants}
								whileHover={{ y: -3 }}
								className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-md border border-gray-200/50 flex flex-col items-center justify-center text-center hover:shadow-lg transition-all duration-300"
							>
								<div className="rounded-full bg-green-50 p-2 mb-2">
									<LeafIcon size={20} className="text-green-500" />
								</div>
								<h3 className="text-sm font-semibold text-green-600">
									Deforestation
								</h3>
							</motion.div>

							{/* Flooding */}
							<motion.div
								variants={itemVariants}
								whileHover={{ y: -3 }}
								className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-md border border-gray-200/50 flex flex-col items-center justify-center text-center hover:shadow-lg transition-all duration-300"
							>
								<div className="rounded-full bg-blue-50 p-2 mb-2">
									<DropletIcon size={20} className="text-blue-500" />
								</div>
								<h3 className="text-sm font-semibold text-blue-600">
									Flooding
								</h3>
							</motion.div>

							{/* Coastal */}
							<motion.div
								variants={itemVariants}
								whileHover={{ y: -3 }}
								className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-md border border-gray-200/50 flex flex-col items-center justify-center text-center hover:shadow-lg transition-all duration-300"
							>
								<div className="rounded-full bg-gray-50 p-2 mb-2">
									<AlertTriangleIcon size={20} className="text-gray-500" />
								</div>
								<h3 className="text-sm font-semibold text-gray-600">Coastal</h3>
							</motion.div>

							{/* Wildfire */}
							<motion.div
								variants={itemVariants}
								whileHover={{ y: -3 }}
								className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-md border border-gray-200/50 flex flex-col items-center justify-center text-center hover:shadow-lg transition-all duration-300"
							>
								<div className="rounded-full bg-red-50 p-2 mb-2">
									<FlameIcon size={20} className="text-red-500" />
								</div>
								<h3 className="text-sm font-semibold text-red-600">Wildfire</h3>
							</motion.div>

							{/* Glacier Melting */}
							<motion.div
								variants={itemVariants}
								whileHover={{ y: -3 }}
								className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-md border border-gray-200/50 flex flex-col items-center justify-center text-center hover:shadow-lg transition-all duration-300"
							>
								<div className="rounded-full bg-cyan-50 p-2 mb-2">
									<ThermometerIcon size={20} className="text-cyan-500" />
								</div>
								<h3 className="text-sm font-semibold text-cyan-600">
									Glaciers
								</h3>
							</motion.div>
						</div>
					</motion.section>

					{/* Call to Action */}
					<motion.section
						variants={itemVariants}
						className="bg-gradient-to-r from-green-600 to-green-800 text-white rounded-xl shadow-lg p-8 text-center relative overflow-hidden"
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
