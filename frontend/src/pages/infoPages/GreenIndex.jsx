import React, { useState } from "react";
import EnvironmentBackgroundLayers from "../../assets/EnvironmentBackgroundLayers";
import forestImage from "../../assets/images/forest.webp";
import deforestationSvg from "../../assets/images/deforestation.svg";
import solutionSvg from "../../assets/images/deforrestation (1).svg";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const GreenIndex = () => {
	const [isCaseStudyOpen, setIsCaseStudyOpen] = useState(false);
	const [isMoreStudiesOpen, setIsMoreStudiesOpen] = useState(false);

	const toggleCaseStudy = () => {
		setIsCaseStudyOpen(!isCaseStudyOpen);
	};

	const toggleMoreStudies = () => {
		setIsMoreStudiesOpen(!isMoreStudiesOpen);
	};

	// Animation variants
	const fadeIn = {
		hidden: { opacity: 0 },
		visible: { opacity: 1, transition: { duration: 0.6 } },
	};

	const staggerChildren = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.2,
			},
		},
	};

	const itemFadeIn = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
	};

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				delayChildren: 0.3,
				staggerChildren: 0.2,
			},
		},
	};

	return (
		<div className="min-h-screen overflow-hidden">
			<EnvironmentBackgroundLayers>
				<motion.main
					className="container mx-auto py-12 px-4"
					initial="hidden"
					animate="visible"
					variants={fadeIn}
				>
					<motion.div
						className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 max-w-4xl mx-auto border border-green-300/40 space-y-10"
						initial={{ y: 50, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ duration: 0.6 }}
					>
						<motion.header className="text-center" variants={fadeIn}>
							<motion.h1
								className="text-4xl md:text-5xl font-bold text-green-800 mb-4"
								initial={{ y: -20, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								transition={{ duration: 0.5, delay: 0.2 }}
							>
								Deforestation
							</motion.h1>
							<motion.p
								className="text-lg md:text-xl text-brown-800"
								initial={{ y: 20, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								transition={{ duration: 0.5, delay: 0.4 }}
							>
								Understanding the causes, consequences, and solutions to one of
								nature's biggest threats.
							</motion.p>
						</motion.header>

						<motion.div
							initial={{ scale: 0.95, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							transition={{ duration: 0.5, delay: 0.3 }}
							whileHover={{ scale: 1.02 }}
							className="overflow-hidden rounded-xl"
						>
							<img
								src={forestImage}
								alt="Lush forest"
								className="rounded-xl w-full h-64 object-cover shadow-md border border-green-200 transform transition-transform duration-300"
							/>
						</motion.div>

						<motion.section
							className="grid md:grid-cols-2 gap-6 items-center"
							variants={fadeIn}
						>
							<motion.div
								initial={{ x: -50, opacity: 0 }}
								animate={{ x: 0, opacity: 1 }}
								transition={{ duration: 0.6 }}
							>
								<h2 className="text-2xl font-semibold text-green-700 mb-2">
									What is Deforestation?
								</h2>
								<p className="text-brown-900 text-lg">
									Deforestation refers to the clearing or thinning of forests by
									humans. It has widespread impacts on biodiversity, climate,
									and local communities.
								</p>
							</motion.div>
							<motion.img
								src={deforestationSvg}
								alt="Deforestation illustration"
								className="w-full max-h-64 object-contain"
								initial={{ x: 50, opacity: 0 }}
								animate={{ x: 0, opacity: 1 }}
								transition={{ duration: 0.6 }}
								whileHover={{ scale: 1.05 }}
							/>
						</motion.section>

						<motion.section
							variants={containerVariants}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, amount: 0.3 }}
						>
							<motion.h2
								className="text-2xl font-semibold text-green-700 mb-4"
								variants={itemFadeIn}
							>
								Causes of Deforestation
							</motion.h2>
							<div className="grid sm:grid-cols-2 gap-4 text-brown-800 text-lg">
								{[
									"🌾 Agricultural expansion",
									"🪓 Logging for timber",
									"🏗️ Urban development",
									"⛏️ Mining operations",
									"🔥 Wildfires (natural & human)",
								].map((cause, index) => (
									<motion.div
										key={index}
										className="bg-green-100 p-4 rounded-lg shadow-sm"
										variants={itemFadeIn}
										whileHover={{
											scale: 1.03,
											backgroundColor: "rgba(167, 243, 208, 0.8)",
										}}
									>
										{cause}
									</motion.div>
								))}
							</div>
						</motion.section>

						<motion.section
							variants={containerVariants}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, amount: 0.3 }}
						>
							<motion.h2
								className="text-2xl font-semibold text-green-700 mb-4"
								variants={itemFadeIn}
							>
								Effects of Deforestation
							</motion.h2>
							<motion.ul
								className="list-disc pl-6 text-brown-900 text-lg space-y-2"
								variants={staggerChildren}
							>
								{[
									"Loss of plant and animal biodiversity",
									"Soil erosion and land degradation",
									"Increased greenhouse gas emissions",
									"Altered rainfall and weather patterns",
									"Displacement of forest-dependent communities",
								].map((effect, index) => (
									<motion.li key={index} variants={itemFadeIn}>
										{effect}
									</motion.li>
								))}
							</motion.ul>
						</motion.section>

						<motion.section
							className="grid md:grid-cols-2 gap-6 items-center"
							variants={containerVariants}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, amount: 0.3 }}
						>
							<motion.img
								src={solutionSvg}
								alt="Solution illustration"
								className="w-full max-h-64 object-contain"
								variants={itemFadeIn}
								whileHover={{ scale: 1.05 }}
							/>
							<div>
								<motion.h2
									className="text-2xl font-semibold text-green-700 mb-2"
									variants={itemFadeIn}
								>
									Solutions to Deforestation
								</motion.h2>
								<motion.ul
									className="list-disc pl-6 text-brown-800 text-lg space-y-2"
									variants={staggerChildren}
								>
									{[
										"Reforestation and afforestation projects",
										"Enforcing forest protection laws",
										"Sustainable logging and farming",
										"Eco-conscious consumer behavior",
										"Supporting indigenous rights and knowledge",
									].map((solution, index) => (
										<motion.li key={index} variants={itemFadeIn}>
											{solution}
										</motion.li>
									))}
								</motion.ul>
							</div>
						</motion.section>

						<motion.section
							variants={containerVariants}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, amount: 0.3 }}
						>
							<motion.h2
								className="text-2xl font-semibold text-green-700 mb-4"
								variants={itemFadeIn}
							>
								What Can You Do?
							</motion.h2>
							<motion.ul
								className="list-disc pl-6 text-brown-900 text-lg space-y-2"
								variants={staggerChildren}
							>
								{[
									"Reduce paper usage and recycle consistently",
									"Choose sustainably sourced wood and products",
									"Plant trees in your community or support reforestation projects",
									"Raise awareness through education and social media",
									"Support businesses that prioritize eco-friendly practices",
								].map((action, index) => (
									<motion.li key={index} variants={itemFadeIn}>
										{action}
									</motion.li>
								))}
							</motion.ul>
						</motion.section>

						<motion.section
							className="border border-green-200 rounded-xl overflow-hidden bg-gradient-to-br from-green-50 to-white"
							variants={fadeIn}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, amount: 0.1 }}
						>
							<motion.div
								className="flex items-center justify-between p-4 cursor-pointer"
								onClick={toggleCaseStudy}
								whileHover={{ backgroundColor: "rgba(167, 243, 208, 0.3)" }}
								transition={{ duration: 0.2 }}
							>
								<h2 className="text-2xl font-semibold text-green-700">
									Case Study: Amazon Rainforest Conservation Efforts
								</h2>
								<motion.button
									className="bg-green-100 hover:bg-green-200 text-green-800 p-2 rounded-full transition-all duration-300"
									whileHover={{
										scale: 1.1,
										backgroundColor: "rgba(167, 243, 208, 0.8)",
									}}
									whileTap={{ scale: 0.95 }}
								>
									{isCaseStudyOpen ? (
										<ChevronUp size={24} />
									) : (
										<ChevronDown size={24} />
									)}
								</motion.button>
							</motion.div>

							<AnimatePresence>
								{isCaseStudyOpen && (
									<motion.div
										initial={{ opacity: 0, height: 0 }}
										animate={{ opacity: 1, height: "auto" }}
										exit={{ opacity: 0, height: 0 }}
										transition={{ duration: 0.5, ease: "easeInOut" }}
										className="py-4 px-6"
									>
										<motion.div
											className="grid md:grid-cols-3 gap-6 mb-6"
											variants={staggerChildren}
											initial="hidden"
											animate="visible"
										>
											{[
												{
													title: "The Challenge",
													content:
														"The Amazon rainforest loses approximately 10,000 square kilometers annually - equivalent to about 40 football fields every minute. Since 1978, over 750,000 km² has been deforested, primarily for cattle ranching and soy production.",
												},
												{
													title: "The Initiative",
													content:
														"The Terra Verde Project launched in 2018 combines satellite monitoring, indigenous partnerships, and sustainable economic alternatives. It operates in five critical regions covering over 50,000 km² of threatened forest.",
												},
												{
													title: "The Results",
													content:
														"Areas under the program have seen a 47% reduction in deforestation rates. Over 2,000 indigenous rangers have been trained, 15 million trees planted, and 12,000 hectares of degraded land restored to productivity.",
												},
											].map((item, index) => (
												<motion.div
													key={index}
													className="bg-white rounded-lg p-4 shadow-sm border border-green-100"
													variants={itemFadeIn}
													whileHover={{
														y: -5,
														boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
													}}
												>
													<h3 className="text-lg font-medium text-green-700 mb-2">
														{item.title}
													</h3>
													<p className="text-gray-700">{item.content}</p>
												</motion.div>
											))}
										</motion.div>

										<motion.div
											className="bg-green-50 p-6 rounded-lg border border-green-200 mb-6"
											variants={fadeIn}
											initial="hidden"
											animate="visible"
											transition={{ delay: 0.3 }}
										>
											<h3 className="text-xl font-medium text-green-800 mb-3">
												Key Success Factors
											</h3>
											<motion.ul
												className="grid md:grid-cols-2 gap-4"
												variants={staggerChildren}
											>
												{[
													"Indigenous-led conservation based on traditional knowledge systems",
													"Market-based initiatives creating profitable alternatives to deforestation",
													"Advanced monitoring technology with AI-enabled early warning systems",
													"Integrated policy approach involving governments, NGOs, and local communities",
												].map((factor, index) => (
													<motion.li
														key={index}
														className="flex items-start"
														variants={itemFadeIn}
													>
														<div className="text-green-600 font-bold mr-2">
															{index + 1}.
														</div>
														<p className="text-gray-700">{factor}</p>
													</motion.li>
												))}
											</motion.ul>
										</motion.div>

										<motion.div
											className="cursor-pointer flex items-center justify-between p-4 mt-4 bg-green-100 rounded-lg border border-green-300"
											onClick={toggleMoreStudies}
											whileHover={{
												backgroundColor: "rgba(167, 243, 208, 0.8)",
											}}
											whileTap={{ scale: 0.98 }}
										>
											<h3 className="text-lg font-medium text-green-800">
												View More Case Studies
											</h3>
											{isMoreStudiesOpen ? (
												<ChevronUp size={20} />
											) : (
												<ChevronDown size={20} />
											)}
										</motion.div>

										<AnimatePresence>
											{isMoreStudiesOpen && (
												<motion.div
													initial={{ opacity: 0, height: 0 }}
													animate={{ opacity: 1, height: "auto" }}
													exit={{ opacity: 0, height: 0 }}
													transition={{ duration: 0.3 }}
													className="pt-4"
												>
													<motion.ul
														className="list-disc pl-6 text-gray-700 space-y-3 pt-2"
														variants={staggerChildren}
														initial="hidden"
														animate="visible"
													>
														{[
															{
																title: "Indonesia's REDD+ Program:",
																content:
																	"Using carbon credit systems to fund forest protection and reduce illegal logging.",
															},
															{
																title: "Kenya's Green Belt Movement:",
																content:
																	"Grassroots community reforestation led by women to restore degraded lands.",
															},
															{
																title: "Peru's Indigenous Land Rights Law:",
																content:
																	"Legal recognition of native territories that curbed commercial exploitation.",
															},
															{
																title: "India's Joint Forest Management:",
																content:
																	"Collaborative approach between local communities and forestry departments.",
															},
														].map((study, index) => (
															<motion.li
																key={index}
																variants={itemFadeIn}
																whileHover={{ x: 5 }}
															>
																<b>{study.title}</b> {study.content}
															</motion.li>
														))}
													</motion.ul>
												</motion.div>
											)}
										</AnimatePresence>
									</motion.div>
								)}
							</AnimatePresence>
						</motion.section>

						<motion.footer
							className="text-center mt-8"
							variants={fadeIn}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true }}
						>
							<motion.p
								className="text-green-800 text-lg mb-4"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: 0.2 }}
								whileHover={{ scale: 1.05 }}
							>
								🌍 Every small action counts — let's protect our forests
								together.
							</motion.p>
						</motion.footer>
					</motion.div>
				</motion.main>
			</EnvironmentBackgroundLayers>
		</div>
	);
};

export default GreenIndex;
