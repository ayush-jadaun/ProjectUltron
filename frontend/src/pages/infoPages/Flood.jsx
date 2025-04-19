import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import floodImage from "../../assets/images/floodingtop.jpg";
import floodSvg from "../../assets/images/flood.svg";
import rescueSvg from "../../assets/images/flood2.svg";
import EnvironmentFloodingLayers from "../../assets/EnvironmentFloodingLayers";
import { ChevronDown, ChevronUp } from "lucide-react";

const Flood = () => {
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
		visible: { 
			opacity: 1,
			transition: { duration: 0.8 }
		}
	};

	const slideIn = {
		hidden: { y: 20, opacity: 0 },
		visible: { 
			y: 0, 
			opacity: 1,
			transition: { 
				type: "spring",
				stiffness: 100,
				damping: 15
			}
		}
	};

	const staggerItems = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1
			}
		}
	};

	const expandCollapse = {
		hidden: { 
			height: 0,
			opacity: 0,
			transition: { 
				duration: 0.4,
				ease: "easeInOut"
			}
		},
		visible: { 
			height: "auto",
			opacity: 1,
			transition: { 
				duration: 0.4,
				ease: "easeInOut" 
			}
		}
	};

	return (
		<div className="min-h-screen">
			<EnvironmentFloodingLayers>
				<motion.main 
					className="container mx-auto py-12 px-4"
					initial="hidden"
					animate="visible"
					variants={fadeIn}
				>
					<motion.div 
						className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 max-w-4xl mx-auto border border-blue-300/40 space-y-10"
						variants={slideIn}
					>
						<motion.header 
							className="text-center"
							variants={slideIn}
						>
							<h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-4">
								Floods
							</h1>
							<motion.p 
								className="text-lg md:text-xl text-gray-700"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.2 }}
							>
								A deep dive into one of the most common and devastating natural
								disasters worldwide.
							</motion.p>
						</motion.header>

						<motion.img
							src={floodImage}
							alt="Flooded street"
							className="rounded-xl w-full h-64 object-cover shadow-md border border-blue-200"
							whileHover={{ scale: 1.02 }}
							transition={{ duration: 0.3 }}
						/>

						<motion.section 
							className="grid md:grid-cols-2 gap-6 items-center"
							variants={slideIn}
						>
							<div>
								<h2 className="text-2xl font-semibold text-blue-700 mb-2">
									What is Flooding?
								</h2>
								<p className="text-gray-800 text-lg">
									Flooding occurs when water overflows onto normally dry land.
									It can result from heavy rainfall, storm surges, dam failures,
									or overflowing rivers and lakes.
								</p>
							</div>
							<motion.img
								src={floodSvg}
								alt="Flood illustration"
								className="w-full max-h-64 object-contain"
								whileHover={{ scale: 1.05 }}
								transition={{ duration: 0.3 }}
							/>
						</motion.section>

						<motion.section
							variants={slideIn}
						>
							<h2 className="text-2xl font-semibold text-blue-700 mb-4">
								Causes of Flooding
							</h2>
							<motion.div 
								className="grid sm:grid-cols-2 gap-4 text-gray-800 text-lg"
								variants={staggerItems}
							>
								<motion.div 
									className="bg-blue-100 p-4 rounded-lg shadow-sm"
									variants={slideIn}
									whileHover={{ scale: 1.03, backgroundColor: "#EFF6FF" }}
								>
									🌧️ Intense rainfall
								</motion.div>
								<motion.div 
									className="bg-blue-100 p-4 rounded-lg shadow-sm"
									variants={slideIn}
									whileHover={{ scale: 1.03, backgroundColor: "#EFF6FF" }}
								>
									🌊 Coastal storm surges
								</motion.div>
								<motion.div 
									className="bg-blue-100 p-4 rounded-lg shadow-sm"
									variants={slideIn}
									whileHover={{ scale: 1.03, backgroundColor: "#EFF6FF" }}
								>
									🌿 Deforestation and land use change
								</motion.div>
								<motion.div 
									className="bg-blue-100 p-4 rounded-lg shadow-sm"
									variants={slideIn}
									whileHover={{ scale: 1.03, backgroundColor: "#EFF6FF" }}
								>
									🏞️ River overflow
								</motion.div>
								<motion.div 
									className="bg-blue-100 p-4 rounded-lg shadow-sm"
									variants={slideIn}
									whileHover={{ scale: 1.03, backgroundColor: "#EFF6FF" }}
								>
									🏗️ Poor drainage in urban areas
								</motion.div>
							</motion.div>
						</motion.section>

						<motion.section
							variants={slideIn}
						>
							<h2 className="text-2xl font-semibold text-blue-700 mb-4">
								Effects of Flooding
							</h2>
							<motion.ul 
								className="list-disc pl-6 text-gray-800 text-lg space-y-2"
								variants={staggerItems}
							>
								<motion.li variants={slideIn}>Loss of life and displacement of communities</motion.li>
								<motion.li variants={slideIn}>Damage to infrastructure and homes</motion.li>
								<motion.li variants={slideIn}>Contaminated water and disease outbreaks</motion.li>
								<motion.li variants={slideIn}>Agricultural loss and food insecurity</motion.li>
								<motion.li variants={slideIn}>Long-term economic impact</motion.li>
							</motion.ul>
						</motion.section>

						<motion.section 
							className="grid md:grid-cols-2 gap-6 items-center"
							variants={slideIn}
						>
							<motion.img
								src={rescueSvg}
								alt="Rescue illustration"
								className="w-full max-h-64 object-contain"
								whileHover={{ scale: 1.05 }}
								transition={{ duration: 0.3 }}
							/>
							<div>
								<h2 className="text-2xl font-semibold text-blue-700 mb-2">
									Solutions to Flooding
								</h2>
								<motion.ul 
									className="list-disc pl-6 text-gray-800 text-lg space-y-2"
									variants={staggerItems}
								>
									<motion.li variants={slideIn}>Building flood barriers and levees</motion.li>
									<motion.li variants={slideIn}>Improving drainage and infrastructure</motion.li>
									<motion.li variants={slideIn}>Preserving wetlands and green spaces</motion.li>
									<motion.li variants={slideIn}>Community awareness and early warning systems</motion.li>
									<motion.li variants={slideIn}>Emergency response planning and training</motion.li>
								</motion.ul>
							</div>
						</motion.section>

						<motion.section
							variants={slideIn}
						>
							<h2 className="text-2xl font-semibold text-blue-700 mb-4">
								What to Do During a Flood
							</h2>
							<motion.ul 
								className="list-disc pl-6 text-gray-800 text-lg space-y-2"
								variants={staggerItems}
							>
								<motion.li variants={slideIn}>Move to higher ground immediately</motion.li>
								<motion.li variants={slideIn}>Avoid walking or driving through floodwaters</motion.li>
								<motion.li variants={slideIn}>
									Disconnect electrical appliances and avoid contact with
									electricity
								</motion.li>
								<motion.li variants={slideIn}>
									Keep an emergency kit with essentials like water, food,
									flashlight, and first-aid
								</motion.li>
								<motion.li variants={slideIn}>
									Stay informed through official alerts and radio broadcasts
								</motion.li>
								<motion.li variants={slideIn}>
									If trapped, signal for help with a flashlight or brightly
									colored cloth
								</motion.li>
							</motion.ul>
						</motion.section>

						<motion.section 
							className="border border-blue-200 rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 to-white"
							variants={slideIn}
						>
							<motion.div
								className="flex items-center justify-between p-4 cursor-pointer"
								onClick={toggleCaseStudy}
							>
								<h2 className="text-2xl font-semibold text-blue-700">
									Case Study: The 2023 Midwest Floods
								</h2>
								<button
									className="bg-blue-100 hover:bg-blue-200 text-blue-800 p-2 rounded-full transition-all duration-300"
									aria-label={
										isCaseStudyOpen ? "Close case study" : "Open case study"
									}
								>
									{isCaseStudyOpen ? (
										<ChevronUp size={24} />
									) : (
										<ChevronDown size={24} />
									)}
								</button>
							</motion.div>

							<AnimatePresence>
								{isCaseStudyOpen && (
									<motion.div
										initial="hidden"
										animate="visible"
										exit="hidden"
										variants={expandCollapse}
										className="overflow-hidden"
									>
										<div className="grid md:grid-cols-3 gap-6 mb-6">
											<motion.div 
												className="bg-white rounded-lg p-4 shadow-sm border border-blue-100"
												variants={slideIn}
											>
												<h3 className="text-lg font-medium text-blue-700 mb-2">
													The Event
												</h3>
												<p className="text-gray-700">
													In April 2023, unprecedented rainfall caused major rivers
													across the Midwest to overflow, affecting five states and
													resulting in one of the costliest flood events in recent
													history.
												</p>
											</motion.div>
											<motion.div 
												className="bg-white rounded-lg p-4 shadow-sm border border-blue-100"
												variants={slideIn}
											>
												<h3 className="text-lg font-medium text-blue-700 mb-2">
													The Impact
												</h3>
												<p className="text-gray-700">
													Over 50,000 homes damaged, 12 lives lost, and $3.8 billion
													in economic losses. Agricultural impacts included 400,000
													acres of farmland submerged just before planting season.
												</p>
											</motion.div>
											<motion.div 
												className="bg-white rounded-lg p-4 shadow-sm border border-blue-100"
												variants={slideIn}
											>
												<h3 className="text-lg font-medium text-blue-700 mb-2">
													The Response
												</h3>
												<p className="text-gray-700">
													Emergency services evacuated 15,000 residents. Community
													volunteers filled 1.2 million sandbags. FEMA provided $225
													million in immediate assistance to affected communities.
												</p>
											</motion.div>
										</div>

										<motion.div 
											className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-6"
											variants={slideIn}
										>
											<h3 className="text-xl font-medium text-blue-800 mb-3">
												Key Lessons Learned
											</h3>
											<motion.ul 
												className="grid md:grid-cols-2 gap-4"
												variants={staggerItems}
											>
												<motion.li 
													className="flex items-start"
													variants={slideIn}
												>
													<div className="text-blue-500 font-bold mr-2">1.</div>
													<p className="text-gray-700">
														Early warning systems saved lives but needed better
														coordination between agencies
													</p>
												</motion.li>
												<motion.li 
													className="flex items-start"
													variants={slideIn}
												>
													<div className="text-blue-500 font-bold mr-2">2.</div>
													<p className="text-gray-700">
														Communities with restored wetlands experienced 40% less
														damage than similar areas without them
													</p>
												</motion.li>
												<motion.li 
													className="flex items-start"
													variants={slideIn}
												>
													<div className="text-blue-500 font-bold mr-2">3.</div>
													<p className="text-gray-700">
														Modern building codes proved effective, with new
														structures suffering 65% less damage
													</p>
												</motion.li>
												<motion.li 
													className="flex items-start"
													variants={slideIn}
												>
													<div className="text-blue-500 font-bold mr-2">4.</div>
													<p className="text-gray-700">
														Digital emergency communication reached 93% of
														residents, compared to 67% through traditional means
													</p>
												</motion.li>
											</motion.ul>
										</motion.div>

										<motion.div
											className="cursor-pointer flex items-center justify-between p-4 mt-4 bg-blue-100 rounded-lg border border-blue-300"
											onClick={toggleMoreStudies}
											variants={slideIn}
										>
											<h3 className="text-lg font-medium text-blue-700">
												View More Case Studies
											</h3>
											{isMoreStudiesOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
										</motion.div>

										<AnimatePresence>
											{isMoreStudiesOpen && (
												<motion.div
													initial="hidden"
													animate="visible"
													exit="hidden"
													variants={expandCollapse}
													className="overflow-hidden"
												>
													<motion.ul 
														className="list-disc pl-6 text-gray-700 space-y-3 pt-2"
														variants={staggerItems}
													>
														<motion.li variants={slideIn}>
															<b>Netherlands' Delta Works:</b> World's largest flood protection system
															protecting against North Sea storm surges.
														</motion.li>
														<motion.li variants={slideIn}>
															<b>Bangladesh's Community-Based Flood Warning:</b> Local volunteers
															using simple technology to save lives in vulnerable areas.
														</motion.li>
														<motion.li variants={slideIn}>
															<b>New York City's Climate Resilience Plan:</b> Comprehensive
															approach to protect against rising sea levels and storm surges.
														</motion.li>
													</motion.ul>
												</motion.div>
											)}
										</AnimatePresence>
									</motion.div>
								)}
							</AnimatePresence>
						</motion.section>
					</motion.div>
				</motion.main>
			</EnvironmentFloodingLayers>
		</div>
	);
};

export default Flood;