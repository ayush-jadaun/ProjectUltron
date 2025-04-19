import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FireEnvironmentBackgroundLayers from "../../assets/FireEnvironmentBackgroundLayers";
import wildfireImage from "../../assets/images/wildfire.webp";
import fireSvg from "../../assets/images/wildfire_3043608.png";
import preventionSvg from "../../assets/images/wildfire2.webp";
import { ChevronDown, ChevronUp } from "lucide-react";

const Fire = () => {
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
			<FireEnvironmentBackgroundLayers>
				<motion.main 
					className="container mx-auto py-12 px-4"
					initial="hidden"
					animate="visible"
					variants={fadeIn}
				>
					<motion.div 
						className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 max-w-4xl mx-auto border border-orange-300/40 space-y-10"
						variants={slideIn}
					>
						<motion.header 
							className="text-center"
							variants={slideIn}
						>
							<h1 className="text-4xl md:text-5xl font-bold text-orange-800 mb-4">
								Wildfires
							</h1>
							<motion.p 
								className="text-lg md:text-xl text-brown-800"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.2 }}
							>
								Understanding the causes, impacts, and prevention strategies for one of
								nature's most destructive forces.
							</motion.p>
						</motion.header>

						<motion.img
							src={wildfireImage}
							alt="Forest wildfire"
							className="rounded-xl w-full h-64 object-cover shadow-md border border-orange-200"
							whileHover={{ scale: 1.02 }}
							transition={{ duration: 0.3 }}
						/>

						<motion.section 
							className="grid md:grid-cols-2 gap-6 items-center"
							variants={slideIn}
						>
							<div>
								<h2 className="text-2xl font-semibold text-orange-700 mb-2">
									What are Wildfires?
								</h2>
								<p className="text-brown-900 text-lg">
									Wildfires are uncontrolled fires that burn in wildland vegetation, often
									in rural areas. They can spread quickly, change direction unexpectedly,
									and can have devastating effects on ecosystems and communities.
								</p>
							</div>
							<motion.img
								src={fireSvg}
								alt="Wildfire illustration"
								className="w-full max-h-64 object-contain"
								whileHover={{ scale: 1.05 }}
								transition={{ duration: 0.3 }}
							/>
						</motion.section>

						<motion.section
							variants={slideIn}
						>
							<h2 className="text-2xl font-semibold text-orange-700 mb-4">
								Causes of Wildfires
							</h2>
							<motion.div 
								className="grid sm:grid-cols-2 gap-4 text-brown-800 text-lg"
								variants={staggerItems}
							>
								<motion.div 
									className="bg-orange-100 p-4 rounded-lg shadow-sm"
									variants={slideIn}
									whileHover={{ scale: 1.03, backgroundColor: "#FEF3C7" }}
								>
									⚡ Lightning strikes
								</motion.div>
								<motion.div 
									className="bg-orange-100 p-4 rounded-lg shadow-sm"
									variants={slideIn}
									whileHover={{ scale: 1.03, backgroundColor: "#FEF3C7" }}
								>
									🔥 Unattended campfires
								</motion.div>
								<motion.div 
									className="bg-orange-100 p-4 rounded-lg shadow-sm"
									variants={slideIn}
									whileHover={{ scale: 1.03, backgroundColor: "#FEF3C7" }}
								>
									🚬 Discarded cigarettes
								</motion.div>
								<motion.div 
									className="bg-orange-100 p-4 rounded-lg shadow-sm"
									variants={slideIn}
									whileHover={{ scale: 1.03, backgroundColor: "#FEF3C7" }}
								>
									🔌 Equipment malfunctions
								</motion.div>
								<motion.div 
									className="bg-orange-100 p-4 rounded-lg shadow-sm"
									variants={slideIn}
									whileHover={{ scale: 1.03, backgroundColor: "#FEF3C7" }}
								>
									🧨 Intentional arson
								</motion.div>
							</motion.div>
						</motion.section>

						<motion.section
							variants={slideIn}
						>
							<h2 className="text-2xl font-semibold text-orange-700 mb-4">
								Effects of Wildfires
							</h2>
							<motion.ul 
								className="list-disc pl-6 text-brown-900 text-lg space-y-2"
								variants={staggerItems}
							>
								<motion.li variants={slideIn}>Destruction of forests and wildlife habitats</motion.li>
								<motion.li variants={slideIn}>Air quality deterioration and health risks</motion.li>
								<motion.li variants={slideIn}>Loss of homes and infrastructure</motion.li>
								<motion.li variants={slideIn}>Long-term ecological damage</motion.li>
								<motion.li variants={slideIn}>Soil erosion and increased flooding risk</motion.li>
							</motion.ul>
						</motion.section>

						<motion.section 
							className="grid md:grid-cols-2 gap-6 items-center"
							variants={slideIn}
						>
							<motion.img
								src={preventionSvg}
								alt="Fire prevention illustration"
								className="w-full max-h-64 object-contain"
								whileHover={{ scale: 1.05 }}
								transition={{ duration: 0.3 }}
							/>
							<div>
								<h2 className="text-2xl font-semibold text-orange-700 mb-2">
									Wildfire Prevention
								</h2>
								<motion.ul 
									className="list-disc pl-6 text-brown-800 text-lg space-y-2"
									variants={staggerItems}
								>
									<motion.li variants={slideIn}>Creating defensible space around buildings</motion.li>
									<motion.li variants={slideIn}>Proper disposal of smoking materials</motion.li>
									<motion.li variants={slideIn}>Careful management of campfires</motion.li>
									<motion.li variants={slideIn}>Controlled burns to reduce fuel loads</motion.li>
									<motion.li variants={slideIn}>Early detection systems and monitoring</motion.li>
								</motion.ul>
							</div>
						</motion.section>

						<motion.section
							variants={slideIn}
						>
							<h2 className="text-2xl font-semibold text-orange-700 mb-4">
								What Can You Do?
							</h2>
							<motion.ul 
								className="list-disc pl-6 text-brown-900 text-lg space-y-2"
								variants={staggerItems}
							>
								<motion.li variants={slideIn}>Follow all fire restrictions when outdoors</motion.li>
								<motion.li variants={slideIn}>Create a family emergency plan for wildfires</motion.li>
								<motion.li variants={slideIn}>Keep your property clear of dry brush and debris</motion.li>
								<motion.li variants={slideIn}>Support local firefighting resources</motion.li>
								<motion.li variants={slideIn}>Learn about fire-resistant landscaping techniques</motion.li>
							</motion.ul>
						</motion.section>

						<motion.section 
							className="border border-orange-200 rounded-xl overflow-hidden bg-gradient-to-br from-orange-50 to-white"
							variants={slideIn}
						>
							<motion.div
								className="flex items-center justify-between p-4 cursor-pointer"
								onClick={toggleCaseStudy}
							>
								<h2 className="text-2xl font-semibold text-orange-700">
									Case Study: Australian Bushfire Recovery Efforts
								</h2>
								<button
									className="bg-orange-100 hover:bg-orange-200 text-orange-800 p-2 rounded-full transition-all duration-300"
								>
									{isCaseStudyOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
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
												className="bg-white rounded-lg p-4 shadow-sm border border-orange-100"
												variants={slideIn}
											>
												<h3 className="text-lg font-medium text-orange-700 mb-2">
													The Disaster
												</h3>
												<p className="text-gray-700">
													The 2019-2020 Australian bushfire season, known as the "Black Summer," 
													burned over 46 million acres, destroyed more than 3,500 homes, and 
													killed or displaced nearly 3 billion animals. It was one of the worst 
													wildfire seasons in Australia's history.
												</p>
											</motion.div>
											<motion.div 
												className="bg-white rounded-lg p-4 shadow-sm border border-orange-100"
												variants={slideIn}
											>
												<h3 className="text-lg font-medium text-orange-700 mb-2">
													The Response
												</h3>
												<p className="text-gray-700">
													Project Phoenix was launched in 2020 combining indigenous knowledge, 
													modern technology, and community-led recovery initiatives. The program 
													focused on wildlife rescue, habitat restoration, and building community 
													resilience across affected regions.
												</p>
											</motion.div>
											<motion.div 
												className="bg-white rounded-lg p-4 shadow-sm border border-orange-100"
												variants={slideIn}
											>
												<h3 className="text-lg font-medium text-orange-700 mb-2">
													The Results
												</h3>
												<p className="text-gray-700">
													Within three years, the initiative helped establish 24 wildlife corridors, 
													planted over 8 million native trees, rescued and rehabilitated more than 
													60,000 animals, and implemented fire-resistant construction methods in 
													75% of rebuilt homes.
												</p>
											</motion.div>
										</div>

										<motion.div 
											className="bg-orange-50 p-6 rounded-lg border border-orange-200 mb-6"
											variants={slideIn}
										>
											<h3 className="text-xl font-medium text-orange-800 mb-3">
												Key Success Factors
											</h3>
											<motion.ul 
												className="grid md:grid-cols-2 gap-4"
												variants={staggerItems}
											>
												<motion.li 
													className="flex items-start"
													variants={slideIn}
												>
													<div className="text-orange-600 font-bold mr-2">1.</div>
													<p className="text-gray-700">
														Integration of Aboriginal fire management practices with modern 
														firefighting techniques
													</p>
												</motion.li>
												<motion.li 
													className="flex items-start"
													variants={slideIn}
												>
													<div className="text-orange-600 font-bold mr-2">2.</div>
													<p className="text-gray-700">
														Community-based emergency response networks improving 
														coordination and resilience
													</p>
												</motion.li>
												<motion.li 
													className="flex items-start"
													variants={slideIn}
												>
													<div className="text-orange-600 font-bold mr-2">3.</div>
													<p className="text-gray-700">
														Advanced satellite monitoring systems providing early detection 
														and prediction capabilities
													</p>
												</motion.li>
												<motion.li 
													className="flex items-start"
													variants={slideIn}
												>
													<div className="text-orange-600 font-bold mr-2">4.</div>
													<p className="text-gray-700">
														Holistic ecosystem recovery approach focusing on biodiversity 
														and natural regeneration processes
													</p>
												</motion.li>
											</motion.ul>
										</motion.div>

										<motion.div
											className="cursor-pointer flex items-center justify-between p-4 mt-4 bg-orange-100 rounded-lg border border-orange-300"
											onClick={toggleMoreStudies}
											variants={slideIn}
										>
											<h3 className="text-lg font-medium text-orange-800">
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
															<b>California's Forest Management Revolution:</b> Implementing prescribed 
															burns and mechanical thinning to reduce catastrophic wildfire risk.
														</motion.li>
														<motion.li variants={slideIn}>
															<b>Portugal's National Fire Prevention Network:</b> Community-based 
															approach creating fire-resistant landscapes and evacuation systems.
														</motion.li>
														<motion.li variants={slideIn}>
															<b>Canada's FireSmart Program:</b> Educating homeowners and communities 
															about wildfire prevention and property protection strategies.
														</motion.li>
														<motion.li variants={slideIn}>
															<b>Chile's Drone Detection System:</b> Using advanced technology to 
															identify fire outbreaks in remote areas within minutes of ignition.
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
			</FireEnvironmentBackgroundLayers>
		</div>
	);
};

export default Fire;