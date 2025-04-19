import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
	MapPinIcon,
	BellIcon,
	LeafIcon,
	AlertTriangleIcon,
	DropletIcon,
	ThermometerIcon,
	FlameIcon,
	ShieldIcon,
	GlobeIcon,
	UsersIcon,
	ArrowRightIcon,
	ChevronDownIcon,
	ChevronUpIcon,
} from "lucide-react";
import EnvironmentBackgroundLayers from "../assets/EnvironmentBackgroundLayers";

const HomePage = () => {
	const { isAuthenticated } = useSelector((state) => state.auth);
	const navigate = useNavigate();
	const [activeSection, setActiveSection] = useState(null);

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

	const sectionVariants = {
		hidden: { height: 0, opacity: 0 },
		visible: {
			height: "auto",
			opacity: 1,
			transition: {
				duration: 0.5,
				ease: "easeInOut",
			},
		},
		exit: {
			height: 0,
			opacity: 0,
			transition: {
				duration: 0.3,
				ease: "easeInOut",
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
				<main className="container mx-auto py-12 px-4">
					{/* Hero Section */}
					<motion.div
						variants={itemVariants}
						className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-8 max-w-4xl mx-auto border border-gray-200/50 mb-12 relative overflow-hidden"
					>
						{/* Decorative elements */}
						<motion.div
							animate={{
								scale: [1, 1.2, 1],
								opacity: [0.2, 0.3, 0.2],
							}}
							transition={{
								duration: 8,
								repeat: Infinity,
								ease: "easeInOut",
							}}
							className="absolute -top-10 -right-10 w-40 h-40 bg-green-100/20 rounded-full blur-2xl"
						></motion.div>
						<motion.div
							animate={{
								scale: [1, 1.2, 1],
								opacity: [0.2, 0.3, 0.2],
							}}
							transition={{
								duration: 8,
								repeat: Infinity,
								ease: "easeInOut",
								delay: 2,
							}}
							className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-100/20 rounded-full blur-2xl"
						></motion.div>
						
						<div className="relative z-10">
							<motion.h1
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6 }}
								className="text-4xl md:text-5xl font-bold  mb-6 bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent"
							>
								Take Action for Our Planet
							</motion.h1>
							<motion.p
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: 0.2 }}
								className="text-xl text-gray-600 mb-8 max-w-2xl leading-relaxed"
							>
								EcoAlert helps you stay informed about environmental changes in
								regions you care about. Get timely notifications about
								deforestation, flooding, air pollution, and other ecological
								issues before irreversible damage occurs.
							</motion.p>
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: 0.4 }}
								className="flex flex-wrap gap-4"
							>
								{!isAuthenticated && (
									<motion.button
										whileHover={{ scale: 1.05, x: 5 }}
										whileTap={{ scale: 0.95 }}
										onClick={handleLogin}
										className="px-8 py-3 bg-white hover:bg-gray-50 text-green-600 font-medium rounded-lg shadow-md transition-all duration-300 border-2 border-green-500 flex items-center gap-2 group"
									>
										<BellIcon size={20} className="group-hover:rotate-12 transition-transform" />
										Already a member? Sign in
										<ArrowRightIcon size={20} className="group-hover:translate-x-1 transition-transform" />
									</motion.button>
								)}
								{isAuthenticated && (
									<motion.button
										whileHover={{ scale: 1.05, x: 5 }}
										whileTap={{ scale: 0.95 }}
										onClick={() => navigate("/map")}
										className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-md transition-all duration-300 flex items-center gap-2 group"
									>
										<MapPinIcon size={20} className="group-hover:rotate-12 transition-transform" />
										Get Started
										<ArrowRightIcon size={20} className="group-hover:translate-x-1 transition-transform" />
									</motion.button>
								)}
							</motion.div>
						</div>
					</motion.div>

					{/* Our Mission Section */}
					<motion.section
						variants={itemVariants}
						className="mb-16"
					>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}
							className="flex items-center justify-center gap-4 mb-12"
						>
							<motion.div
								animate={{ rotate: 360 }}
								transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
							>
								<GlobeIcon size={32} className="text-green-600" />
							</motion.div>
							<h2 className="text-3xl font-bold text-center text-green-700">
								Our Mission
							</h2>
							<ShieldIcon size={32} className="text-green-600" />
						</motion.div>
						<div className="grid md:grid-cols-2 gap-8 items-center">
							<motion.div
								whileHover={{ y: -5 }}
								className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300"
							>
								<motion.h3
									initial={{ opacity: 0, x: -20 }}
									whileInView={{ opacity: 1, x: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.6 }}
									className="text-2xl font-semibold text-green-600 mb-4"
								>
									Timely Information Saves Ecosystems
								</motion.h3>
								<motion.p
									initial={{ opacity: 0, x: -20 }}
									whileInView={{ opacity: 1, x: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.6, delay: 0.2 }}
									className="text-gray-600 mb-4 text-lg leading-relaxed"
								>
									Environmental degradation often happens gradually, making it
									difficult to notice until significant damage has occurred. Our
									alert system monitors environmental changes in real-time using
									satellite data and on-ground sensors.
								</motion.p>
								<motion.p
									initial={{ opacity: 0, x: -20 }}
									whileInView={{ opacity: 1, x: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.6, delay: 0.4 }}
									className="text-gray-600 text-lg leading-relaxed"
								>
									By providing early warnings about deforestation, flooding,
									glacier melting, and air pollution, we empower communities,
									conservationists, and authorities to take preventive action
									before permanent damage occurs.
								</motion.p>
							</motion.div>
							<motion.div
								whileHover={{ y: -5 }}
								className="h-96 border-2 border-gray-200 rounded-xl overflow-hidden bg-gray-100/50 backdrop-blur-sm shadow-inner hover:shadow-xl transition-all duration-300"
							>
								<iframe
									src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15283674.799797209!2d72.09858950579333!3d20.73595779415586!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30635ff06b92b791%3A0xd78c4fa1854213a6!2sIndia!5e0!3m2!1sen!2sin!4v1745021275104!5m2!1sen!2sin"
									width="100%"
									height="100%"
									allowFullScreen=""
									loading="lazy"
									referrerPolicy="no-referrer-when-downgrade"
									className="rounded-xl"
								></iframe>
							</motion.div>
						</div>
					</motion.section>

					{/* Key Focus Areas */}
					<motion.section
						variants={itemVariants}
						className="mb-16"
					>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}
							className="flex items-center justify-center gap-4 mb-12"
						>
							<motion.div
								animate={{ rotate: 360 }}
								transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
							>
								<UsersIcon size={32} className="text-green-600" />
							</motion.div>
							<h2 className="text-3xl font-bold text-center text-green-700">
								Key Focus Areas
							</h2>
							<motion.div
								animate={{ rotate: 360 }}
								transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
							>
								<UsersIcon size={32} className="text-green-600" />
							</motion.div>
						</motion.div>
						<motion.div
							variants={containerVariants}
							className="grid md:grid-cols-2 lg:grid-cols-5 gap-6"
						>
							{/* Deforestation */}
							<motion.div
								variants={itemVariants}
								whileHover={{ y: -5 }}
								className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-200/50 flex flex-col items-center text-center hover:shadow-xl transition-all duration-300 cursor-pointer"
								onClick={() => setActiveSection(activeSection === 0 ? null : 0)}
							>
								<motion.div
									animate={{ scale: [1, 1.1, 1] }}
									transition={{ duration: 2, repeat: Infinity }}
									className="rounded-full bg-green-50 p-4 mb-4"
								>
									<LeafIcon size={28} className="text-green-500" />
								</motion.div>
								<motion.h3
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.6 }}
									className="text-xl font-semibold text-green-600 mb-3"
								>
									Deforestation Prevention
								</motion.h3>
								<AnimatePresence>
									{activeSection === 0 && (
										<motion.p
											variants={sectionVariants}
											initial="hidden"
											animate="visible"
											exit="exit"
											className="text-gray-600 text-base"
										>
											Detect early signs of illegal logging, land clearing, and
											forest fires to protect our critical forest ecosystems.
										</motion.p>
									)}
								</AnimatePresence>
								<motion.div
									animate={{ rotate: activeSection === 0 ? 180 : 0 }}
									transition={{ duration: 0.3 }}
									className="mt-4"
								>
									{activeSection === 0 ? <ChevronUpIcon size={24} /> : <ChevronDownIcon size={24} />}
								</motion.div>
							</motion.div>

							{/* Flooding */}
							<motion.div
								variants={itemVariants}
								whileHover={{ y: -5 }}
								className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-200/50 flex flex-col items-center text-center hover:shadow-xl transition-all duration-300 cursor-pointer"
								onClick={() => setActiveSection(activeSection === 1 ? null : 1)}
							>
								<motion.div
									animate={{ scale: [1, 1.1, 1] }}
									transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
									className="rounded-full bg-blue-50 p-4 mb-4"
								>
									<DropletIcon size={28} className="text-blue-500" />
								</motion.div>
								<motion.h3
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.6 }}
									className="text-xl font-semibold text-blue-600 mb-3"
								>
									Flood Management
								</motion.h3>
								<AnimatePresence>
									{activeSection === 1 && (
										<motion.p
											variants={sectionVariants}
											initial="hidden"
											animate="visible"
											exit="exit"
											className="text-gray-600 text-base"
										>
											Early flood warnings help communities evacuate and authorities
											implement preventive measures before devastating floods occur.
										</motion.p>
									)}
								</AnimatePresence>
								<motion.div
									animate={{ rotate: activeSection === 1 ? 180 : 0 }}
									transition={{ duration: 0.3 }}
									className="mt-4"
								>
									{activeSection === 1 ? <ChevronUpIcon size={24} /> : <ChevronDownIcon size={24} />}
								</motion.div>
							</motion.div>

							{/* Coastal */}
							<motion.div
								variants={itemVariants}
								whileHover={{ y: -5 }}
								className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-200/50 flex flex-col items-center text-center hover:shadow-xl transition-all duration-300 cursor-pointer"
								onClick={() => setActiveSection(activeSection === 2 ? null : 2)}
							>
								<motion.div
									animate={{ scale: [1, 1.1, 1] }}
									transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
									className="rounded-full bg-gray-50 p-4 mb-4"
								>
									<AlertTriangleIcon size={28} className="text-gray-500" />
								</motion.div>
								<motion.h3
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.6 }}
									className="text-xl font-semibold text-gray-600 mb-3"
								>
									Coastal Erosion
								</motion.h3>
								<AnimatePresence>
									{activeSection === 2 && (
										<motion.p
											variants={sectionVariants}
											initial="hidden"
											animate="visible"
											exit="exit"
											className="text-gray-600 text-base"
										>
											Monitor dangerous levels of coastal erosion for public safety
											and identify sources requiring immediate intervention by the
											authorities.
										</motion.p>
									)}
								</AnimatePresence>
								<motion.div
									animate={{ rotate: activeSection === 2 ? 180 : 0 }}
									transition={{ duration: 0.3 }}
									className="mt-4"
								>
									{activeSection === 2 ? <ChevronUpIcon size={24} /> : <ChevronDownIcon size={24} />}
								</motion.div>
							</motion.div>

							{/* Wildfire */}
							<motion.div
								variants={itemVariants}
								whileHover={{ y: -5 }}
								className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-200/50 flex flex-col items-center text-center hover:shadow-xl transition-all duration-300 cursor-pointer"
								onClick={() => setActiveSection(activeSection === 3 ? null : 3)}
							>
								<motion.div
									animate={{ scale: [1, 1.1, 1] }}
									transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
									className="rounded-full bg-red-50 p-4 mb-4"
								>
									<FlameIcon size={28} className="text-red-500" />
								</motion.div>
								<motion.h3
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.6 }}
									className="text-xl font-semibold text-red-600 mb-3"
								>
									Wildfire Prevention
								</motion.h3>
								<AnimatePresence>
									{activeSection === 3 && (
										<motion.p
											variants={sectionVariants}
											initial="hidden"
											animate="visible"
											exit="exit"
											className="text-gray-600 text-base"
										>
											Monitor high-risk areas and implement early warning systems to
											protect communities and preserve natural habitats from
											devastating wildfires.
										</motion.p>
									)}
								</AnimatePresence>
								<motion.div
									animate={{ rotate: activeSection === 3 ? 180 : 0 }}
									transition={{ duration: 0.3 }}
									className="mt-4"
								>
									{activeSection === 3 ? <ChevronUpIcon size={24} /> : <ChevronDownIcon size={24} />}
								</motion.div>
							</motion.div>

							{/* Glacier Melting */}
							<motion.div
								variants={itemVariants}
								whileHover={{ y: -5 }}
								className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-200/50 flex flex-col items-center text-center hover:shadow-xl transition-all duration-300 cursor-pointer"
								onClick={() => setActiveSection(activeSection === 4 ? null : 4)}
							>
								<motion.div
									animate={{ scale: [1, 1.1, 1] }}
									transition={{ duration: 2, repeat: Infinity, delay: 0.8 }}
									className="rounded-full bg-cyan-50 p-4 mb-4"
								>
									<ThermometerIcon size={28} className="text-cyan-500" />
								</motion.div>
								<motion.h3
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.6 }}
									className="text-xl font-semibold text-cyan-600 mb-3"
								>
									Glacier Protection
								</motion.h3>
								<AnimatePresence>
									{activeSection === 4 && (
										<motion.p
											variants={sectionVariants}
											initial="hidden"
											animate="visible"
											exit="exit"
											className="text-gray-600 text-base"
										>
											Track accelerated glacier melting to understand climate change
											impacts and help communities prepare for changing water
											supplies.
										</motion.p>
									)}
								</AnimatePresence>
								<motion.div
									animate={{ rotate: activeSection === 4 ? 180 : 0 }}
									transition={{ duration: 0.3 }}
									className="mt-4"
								>
									{activeSection === 4 ? <ChevronUpIcon size={24} /> : <ChevronDownIcon size={24} />}
								</motion.div>
							</motion.div>
						</motion.div>
					</motion.section>

					{/* Call to Action */}
					<motion.section
						variants={itemVariants}
						className="bg-gradient-to-r from-green-600 to-green-800 text-white rounded-xl shadow-lg p-8 text-center relative overflow-hidden"
					>
						{/* Decorative elements */}
						<motion.div
							animate={{
								scale: [1, 1.2, 1],
								opacity: [0.1, 0.2, 0.1],
							}}
							transition={{
								duration: 8,
								repeat: Infinity,
								ease: "easeInOut",
							}}
							className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-2xl"
						></motion.div>
						<motion.div
							animate={{
								scale: [1, 1.2, 1],
								opacity: [0.1, 0.2, 0.1],
							}}
							transition={{
								duration: 8,
								repeat: Infinity,
								ease: "easeInOut",
								delay: 2,
							}}
							className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/10 rounded-full blur-2xl"
						></motion.div>
						
						<div className="relative z-10">
							<motion.h2
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6 }}
								className="text-3xl font-bold mb-6"
							>
								Join Our Environmental Alert Network
							</motion.h2>
							<motion.p
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6, delay: 0.2 }}
								className="text-xl mb-8 max-w-2xl mx-auto"
							>
								Subscribe to receive timely alerts about environmental changes in
								regions you care about. Together, we can protect our planet for
								future generations.
							</motion.p>
							<motion.button
								whileHover={{ scale: 1.05, x: 5 }}
								whileTap={{ scale: 0.95 }}
								onClick={handleGetStarted}
								className="px-8 py-3 bg-white hover:bg-gray-50 text-green-600 font-medium rounded-lg shadow-md transition-all duration-300 flex items-center gap-2 group mx-auto"
							>
								Set Up Your Alerts Today
								<ArrowRightIcon size={20} className="group-hover:translate-x-1 transition-transform" />
							</motion.button>
						</div>
					</motion.section>
				</main>
			</EnvironmentBackgroundLayers>
		</motion.div>
	);
};

export default HomePage;
