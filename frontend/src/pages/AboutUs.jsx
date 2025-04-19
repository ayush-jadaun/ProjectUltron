import React from "react";
import { motion } from "framer-motion";
import {
	UsersIcon,
	ShieldIcon,
	GlobeIcon,
	LeafIcon,
	TargetIcon,
	HeartIcon,
} from "lucide-react";
import EnvironmentBackgroundLayers from "../assets/EnvironmentBackgroundLayers";

const AboutUs = () => {
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
				<main className="container mx-auto py-12 px-4">
					{/* Hero Section */}
					<motion.section
						variants={itemVariants}
						className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-8 max-w-4xl mx-auto border border-gray-200/50 mb-12 relative overflow-hidden"
					>
						<div className="relative z-10">
							<motion.h1
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6 }}
								className="text-4xl md:text-5xl font-bold text-green-700 mb-6 bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent"
							>
								About EcoAlert
							</motion.h1>
							<motion.p
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: 0.2 }}
								className="text-xl text-gray-600 mb-8 max-w-2xl leading-relaxed"
							>
								We are a team of environmental enthusiasts, technologists, and
								conservationists dedicated to protecting our planet through
								innovative technology solutions.
							</motion.p>
						</div>
					</motion.section>

					{/* Mission & Vision */}
					<motion.section
						variants={itemVariants}
						className="grid md:grid-cols-2 gap-8 mb-16"
					>
						<motion.div
							whileHover={{ y: -5 }}
							className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300"
						>
							<motion.div
								animate={{ rotate: 360 }}
								transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
								className="mb-6"
							>
								<TargetIcon size={32} className="text-green-600" />
							</motion.div>
							<motion.h2
								initial={{ opacity: 0, x: -20 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6 }}
								className="text-2xl font-semibold text-green-600 mb-4"
							>
								Our Mission
							</motion.h2>
							<motion.p
								initial={{ opacity: 0, x: -20 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6, delay: 0.2 }}
								className="text-gray-600 text-lg leading-relaxed"
							>
								To empower individuals and organizations with real-time
								environmental data and early warning systems, enabling proactive
								conservation efforts and sustainable decision-making.
							</motion.p>
						</motion.div>

						<motion.div
							whileHover={{ y: -5 }}
							className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300"
						>
							<motion.div
								animate={{ rotate: 360 }}
								transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
								className="mb-6"
							>
								<GlobeIcon size={32} className="text-green-600" />
							</motion.div>
							<motion.h2
								initial={{ opacity: 0, x: -20 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6 }}
								className="text-2xl font-semibold text-green-600 mb-4"
							>
								Our Vision
							</motion.h2>
							<motion.p
								initial={{ opacity: 0, x: -20 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6, delay: 0.2 }}
								className="text-gray-600 text-lg leading-relaxed"
							>
								A world where environmental monitoring and protection are
								accessible to everyone, creating a global network of informed
								environmental stewards.
							</motion.p>
						</motion.div>
					</motion.section>

					{/* Values */}
					<motion.section
						variants={itemVariants}
						className="mb-16"
					>
						<motion.h2
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}
							className="text-3xl font-bold text-center text-green-700 mb-12"
						>
							Our Core Values
						</motion.h2>
						<div className="grid md:grid-cols-3 gap-6">
							<motion.div
								whileHover={{ y: -5 }}
								className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300"
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
									Sustainability
								</motion.h3>
								<motion.p
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.6, delay: 0.2 }}
									className="text-gray-600"
								>
									We believe in creating solutions that promote long-term
									environmental sustainability and balance.
								</motion.p>
							</motion.div>

							<motion.div
								whileHover={{ y: -5 }}
								className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300"
							>
								<motion.div
									animate={{ scale: [1, 1.1, 1] }}
									transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
									className="rounded-full bg-blue-50 p-4 mb-4"
								>
									<ShieldIcon size={28} className="text-blue-500" />
								</motion.div>
								<motion.h3
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.6 }}
									className="text-xl font-semibold text-blue-600 mb-3"
								>
									Integrity
								</motion.h3>
								<motion.p
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.6, delay: 0.2 }}
									className="text-gray-600"
								>
									We maintain the highest standards of honesty and transparency
									in all our operations.
								</motion.p>
							</motion.div>

							<motion.div
								whileHover={{ y: -5 }}
								className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300"
							>
								<motion.div
									animate={{ scale: [1, 1.1, 1] }}
									transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
									className="rounded-full bg-red-50 p-4 mb-4"
								>
									<HeartIcon size={28} className="text-red-500" />
								</motion.div>
								<motion.h3
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.6 }}
									className="text-xl font-semibold text-red-600 mb-3"
								>
									Passion
								</motion.h3>
								<motion.p
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.6, delay: 0.2 }}
									className="text-gray-600"
								>
									Our work is driven by a deep passion for environmental
									conservation and protection.
								</motion.p>
							</motion.div>
						</div>
					</motion.section>

					{/* Team */}
					<motion.section
						variants={itemVariants}
						className="mb-16"
					>
						<motion.h2
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}
							className="text-3xl font-bold text-center text-green-700 mb-12"
						>
							Our Team
						</motion.h2>
						<div className="grid md:grid-cols-2 gap-8">
							<motion.div
								whileHover={{ y: -5 }}
								className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 text-center"
							>
								<div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
								<motion.h3
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.6 }}
									className="text-xl font-semibold text-green-600 mb-2"
								>
									Ayush Jadaun
								</motion.h3>
								<motion.p
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.6, delay: 0.2 }}
									className="text-gray-600"
								>
									Full Stack Dev
								</motion.p>
							</motion.div>

							<motion.div
								whileHover={{ y: -5 }}
								className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 text-center"
							>
								<div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
								<motion.h3
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.6 }}
									className="text-xl font-semibold text-green-600 mb-2"
								>
									Ayush Agarwal
								</motion.h3>
								<motion.p
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.6, delay: 0.2 }}
									className="text-gray-600"
								>
									Full Stack Dev
								</motion.p>
							</motion.div>

						</div>
					</motion.section>
				</main>
			</EnvironmentBackgroundLayers>
		</motion.div>
	);
};

export default AboutUs; 