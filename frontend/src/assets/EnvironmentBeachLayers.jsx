import React from "react";
import { motion } from "framer-motion";

const EnvironmentBeachLayers = ({ children }) => {
	return (
		<div className="relative min-h-screen w-full overflow-hidden">
			{/* Sky gradient background */}
			<div className="absolute inset-0 z-[-5] bg-gradient-to-b from-sky-100 via-sky-200 to-sky-300"></div>

			{/* Animated sun */}
			<motion.div 
				className="absolute top-[10%] left-[80%] z-[-4]"
				animate={{
					x: [0, -50, 0],
					y: [0, -20, 0],
					scale: [1, 1.1, 1],
					opacity: [1, 0.9, 1]
				}}
				transition={{
					duration: 20,
					repeat: Infinity,
					ease: "easeInOut"
				}}
			>
				<div className="w-20 h-20 sm:w-24 sm:h-24 bg-yellow-400 rounded-full shadow-[0_0_50px_rgba(255,255,0,0.5)]">
					<div className="absolute inset-0 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full"></div>
					<div className="absolute inset-0 bg-gradient-to-br from-yellow-200 to-transparent rounded-full opacity-50"></div>
				</div>
			</motion.div>

			{/* Animated clouds */}
			<div className="absolute inset-0 z-[-4] pointer-events-none">
				{/* Large cloud 1 */}
				<motion.div 
					className="absolute top-[5%] left-[5%]"
					animate={{
						x: [0, 15, 0],
						y: [0, -5, 0],
						opacity: [0.9, 0.7, 0.9],
						scale: [1, 1.05, 1]
					}}
					transition={{
						duration: 12,
						repeat: Infinity,
						ease: "easeInOut"
					}}
				>
					<div className="w-32 h-16 sm:w-40 sm:h-20 bg-white/90 rounded-full opacity-90 relative shadow-lg">
						<div className="absolute -top-6 left-6 w-20 h-20 sm:w-24 sm:h-24 bg-white/90 rounded-full shadow-md"></div>
						<div className="absolute -top-4 -right-4 w-16 h-16 sm:w-20 sm:h-20 bg-white/90 rounded-full shadow-md"></div>
						<div className="absolute top-2 right-8 w-12 h-12 sm:w-16 sm:h-16 bg-white/90 rounded-full shadow-md"></div>
					</div>
				</motion.div>

				{/* Large cloud 2 */}
				<motion.div 
					className="absolute top-[15%] left-[15%] scale-90"
					animate={{
						x: [0, -20, 0],
						y: [0, 5, 0],
						opacity: [0.85, 0.65, 0.85],
						scale: [0.9, 0.95, 0.9]
					}}
					transition={{
						duration: 15,
						repeat: Infinity,
						ease: "easeInOut"
					}}
				>
					<div className="w-36 h-18 sm:w-44 sm:h-22 bg-white/85 rounded-full opacity-85 relative shadow-lg">
						<div className="absolute -top-7 left-7 w-22 h-22 sm:w-26 sm:h-26 bg-white/85 rounded-full shadow-md"></div>
						<div className="absolute -top-5 -right-5 w-18 h-18 sm:w-22 sm:h-22 bg-white/85 rounded-full shadow-md"></div>
						<div className="absolute top-3 right-10 w-14 h-14 sm:w-18 sm:h-18 bg-white/85 rounded-full shadow-md"></div>
					</div>
				</motion.div>

				{/* Medium cloud 1 */}
				<motion.div 
					className="absolute top-[8%] left-[25%] scale-75"
					animate={{
						x: [0, 10, 0],
						y: [0, -3, 0],
						opacity: [0.8, 0.6, 0.8],
						scale: [0.75, 0.8, 0.75]
					}}
					transition={{
						duration: 10,
						repeat: Infinity,
						ease: "easeInOut"
					}}
				>
					<div className="w-24 h-12 sm:w-32 sm:h-16 bg-white/80 rounded-full opacity-80 relative shadow-lg">
						<div className="absolute -top-4 left-4 w-16 h-16 sm:w-20 sm:h-20 bg-white/80 rounded-full shadow-md"></div>
						<div className="absolute -top-2 -right-2 w-12 h-12 sm:w-16 sm:h-16 bg-white/80 rounded-full shadow-md"></div>
					</div>
				</motion.div>

				{/* Medium cloud 2 */}
				<motion.div 
					className="absolute top-[25%] left-[10%] scale-80"
					animate={{
						x: [0, -15, 0],
						y: [0, 4, 0],
						opacity: [0.75, 0.55, 0.75],
						scale: [0.8, 0.85, 0.8]
					}}
					transition={{
						duration: 13,
						repeat: Infinity,
						ease: "easeInOut"
					}}
				>
					<div className="w-28 h-14 sm:w-36 sm:h-18 bg-white/75 rounded-full opacity-75 relative shadow-lg">
						<div className="absolute -top-5 left-5 w-18 h-18 sm:w-22 sm:h-22 bg-white/75 rounded-full shadow-md"></div>
						<div className="absolute -top-3 -right-3 w-14 h-14 sm:w-18 sm:h-18 bg-white/75 rounded-full shadow-md"></div>
					</div>
				</motion.div>

				{/* Small cloud 1 */}
				<motion.div 
					className="absolute top-[12%] left-[35%] scale-50"
					animate={{
						x: [0, 8, 0],
						y: [0, -2, 0],
						opacity: [0.7, 0.5, 0.7],
						scale: [0.5, 0.55, 0.5]
					}}
					transition={{
						duration: 8,
						repeat: Infinity,
						ease: "easeInOut"
					}}
				>
					<div className="w-16 h-8 sm:w-20 sm:h-10 bg-white/70 rounded-full opacity-70 relative shadow-lg">
						<div className="absolute -top-3 left-3 w-10 h-10 sm:w-12 sm:h-12 bg-white/70 rounded-full shadow-md"></div>
						<div className="absolute -top-1 -right-1 w-8 h-8 sm:w-10 sm:h-10 bg-white/70 rounded-full shadow-md"></div>
					</div>
				</motion.div>

				{/* Small cloud 2 */}
				<motion.div 
					className="absolute top-[30%] left-[20%] scale-60"
					animate={{
						x: [0, -10, 0],
						y: [0, 3, 0],
						opacity: [0.65, 0.45, 0.65],
						scale: [0.6, 0.65, 0.6]
					}}
					transition={{
						duration: 11,
						repeat: Infinity,
						ease: "easeInOut"
					}}
				>
					<div className="w-20 h-10 sm:w-24 sm:h-12 bg-white/65 rounded-full opacity-65 relative shadow-lg">
						<div className="absolute -top-4 left-4 w-12 h-12 sm:w-14 sm:h-14 bg-white/65 rounded-full shadow-md"></div>
						<div className="absolute -top-2 -right-2 w-10 h-10 sm:w-12 sm:h-12 bg-white/65 rounded-full shadow-md"></div>
					</div>
				</motion.div>

				{/* Tiny cloud 1 */}
				<motion.div 
					className="absolute top-[18%] left-[30%] scale-40"
					animate={{
						x: [0, 5, 0],
						y: [0, -1, 0],
						opacity: [0.6, 0.4, 0.6],
						scale: [0.4, 0.45, 0.4]
					}}
					transition={{
						duration: 7,
						repeat: Infinity,
						ease: "easeInOut"
					}}
				>
					<div className="w-12 h-6 sm:w-16 sm:h-8 bg-white/60 rounded-full opacity-60 relative shadow-lg">
						<div className="absolute -top-2 left-2 w-8 h-8 sm:w-10 sm:h-10 bg-white/60 rounded-full shadow-md"></div>
					</div>
				</motion.div>

				{/* Tiny cloud 2 */}
				<motion.div 
					className="absolute top-[22%] left-[5%] scale-45"
					animate={{
						x: [0, -7, 0],
						y: [0, 2, 0],
						opacity: [0.55, 0.35, 0.55],
						scale: [0.45, 0.5, 0.45]
					}}
					transition={{
						duration: 9,
						repeat: Infinity,
						ease: "easeInOut"
					}}
				>
					<div className="w-14 h-7 sm:w-18 sm:h-9 bg-white/55 rounded-full opacity-55 relative shadow-lg">
						<div className="absolute -top-3 left-3 w-9 h-9 sm:w-11 sm:h-11 bg-white/55 rounded-full shadow-md"></div>
					</div>
				</motion.div>

				{/* Additional moving clouds */}
				{/* Large cloud 3 */}
				<motion.div 
					className="absolute top-[35%] left-[8%] scale-85"
					animate={{
						x: [0, 25, 0],
						y: [0, -8, 0],
						opacity: [0.8, 0.6, 0.8],
						scale: [0.85, 0.9, 0.85]
					}}
					transition={{
						duration: 18,
						repeat: Infinity,
						ease: "easeInOut"
					}}
				>
					<div className="w-34 h-17 sm:w-42 sm:h-21 bg-white/80 rounded-full opacity-80 relative shadow-lg">
						<div className="absolute -top-6 left-6 w-22 h-22 sm:w-26 sm:h-26 bg-white/80 rounded-full shadow-md"></div>
						<div className="absolute -top-4 -right-4 w-18 h-18 sm:w-22 sm:h-22 bg-white/80 rounded-full shadow-md"></div>
						<div className="absolute top-2 right-8 w-14 h-14 sm:w-18 sm:h-18 bg-white/80 rounded-full shadow-md"></div>
					</div>
				</motion.div>

				{/* Medium cloud 3 */}
				<motion.div 
					className="absolute top-[40%] left-[25%] scale-70"
					animate={{
						x: [0, -18, 0],
						y: [0, 6, 0],
						opacity: [0.7, 0.5, 0.7],
						scale: [0.7, 0.75, 0.7]
					}}
					transition={{
						duration: 14,
						repeat: Infinity,
						ease: "easeInOut"
					}}
				>
					<div className="w-26 h-13 sm:w-34 sm:h-17 bg-white/70 rounded-full opacity-70 relative shadow-lg">
						<div className="absolute -top-5 left-5 w-16 h-16 sm:w-20 sm:h-20 bg-white/70 rounded-full shadow-md"></div>
						<div className="absolute -top-3 -right-3 w-14 h-14 sm:w-18 sm:h-18 bg-white/70 rounded-full shadow-md"></div>
					</div>
				</motion.div>

				{/* Small cloud 3 */}
				<motion.div 
					className="absolute top-[45%] left-[15%] scale-55"
					animate={{
						x: [0, 12, 0],
						y: [0, -4, 0],
						opacity: [0.65, 0.45, 0.65],
						scale: [0.55, 0.6, 0.55]
					}}
					transition={{
						duration: 16,
						repeat: Infinity,
						ease: "easeInOut"
					}}
				>
					<div className="w-18 h-9 sm:w-22 sm:h-11 bg-white/65 rounded-full opacity-65 relative shadow-lg">
						<div className="absolute -top-3 left-3 w-12 h-12 sm:w-14 sm:h-14 bg-white/65 rounded-full shadow-md"></div>
						<div className="absolute -top-1 -right-1 w-10 h-10 sm:w-12 sm:h-12 bg-white/65 rounded-full shadow-md"></div>
					</div>
				</motion.div>
			</div>

			{/* Far ocean background */}
			<div
				className="absolute bottom-0 left-0 right-0 h-[40%] z-[-1] bg-gradient-to-t from-blue-500 via-blue-400 to-transparent opacity-90"
				style={{
					clipPath:
						"polygon(0 70%, 5% 72%, 10% 68%, 15% 73%, 20% 68%, 25% 74%, 30% 69%, 35% 73%, 40% 68%, 45% 72%, 50% 68%, 55% 73%, 60% 69%, 65% 74%, 70% 70%, 80% 68%, 90% 72%, 95% 68%, 100% 70%, 100% 100%, 0% 100%)",
				}}
			></div>

			{/* Mid-ground ocean waves */}
			<div
				className="absolute bottom-0 left-0 right-0 h-[35%] z-[-1] bg-gradient-to-t from-blue-400 to-blue-300 opacity-90"
				style={{
					clipPath:
						"polygon(0 80%, 8% 77%, 12% 82%, 18% 78%, 25% 83%, 32% 78%, 40% 83%, 48% 78%, 55% 84%, 62% 79%, 70% 85%, 78% 80%, 85% 85%, 92% 79%, 100% 83%, 100% 100%, 0% 100%)",
					animation: "wavesMoving 8s infinite alternate",
				}}
			></div>

			{/* Foreground beach sand */}
			<div
				className="absolute bottom-0 left-0 right-0 h-[25%] z-0 bg-gradient-to-t from-yellow-200 to-yellow-100"
				style={{
					clipPath:
						"polygon(0 90%, 6% 88%, 13% 92%, 20% 88%, 27% 94%, 34% 89%, 42% 93%, 50% 89%, 58% 95%, 65% 90%, 73% 96%, 80% 91%, 88% 95%, 95% 90%, 100% 93%, 100% 100%, 0% 100%)",
				}}
			></div>

			{/* Sand texture */}
			<div className="absolute bottom-0 left-0 right-0 h-1/5 z-0 bg-yellow-100"></div>

			{/* Mario theme beach elements */}
			<div className="absolute bottom-0 left-0 right-0 h-2/3 z-1 pointer-events-none">
				{/* Question block floating in air */}
				<div className="absolute bottom-[60%] left-[25%]">
					<div className="w-12 h-12 sm:w-16 sm:h-16 bg-yellow-300 rounded-md border-2 border-yellow-600 shadow-md flex items-center justify-center">
						<span className="text-xl sm:text-2xl font-bold text-yellow-600">
							?
						</span>
					</div>
				</div>

				{/* Beach umbrella (pipe-style) */}
				<div className="absolute bottom-[8%] left-[20%]">
					<div className="w-4 h-16 bg-green-600 relative">
						<div className="absolute -top-10 -left-8 w-20 h-10 bg-red-500 rounded-full transform -rotate-6"></div>
						<div className="absolute -top-8 -left-6 w-16 h-8 bg-white rounded-full transform -rotate-6"></div>
					</div>
				</div>

				{/* Koopa Troopa swimming */}
				<div className="absolute bottom-[30%] left-[40%]">
					<div className="relative">
						<div className="w-10 h-12 bg-green-300 rounded-full relative">
							<div className="absolute top-0 w-10 h-6 bg-yellow-100 rounded-t-full"></div>
							<div className="absolute top-2 left-2 w-2 h-2 bg-black rounded-full"></div>
							<div className="absolute top-2 left-6 w-2 h-2 bg-black rounded-full"></div>
							<div className="absolute -right-2 top-4 w-6 h-2 bg-green-300 rounded-full transform rotate-45"></div>
							<div className="absolute -left-2 top-4 w-6 h-2 bg-green-300 rounded-full transform -rotate-45"></div>
						</div>
					</div>
				</div>

				{/* Cheep Cheep fish */}
				<div className="absolute bottom-[25%] left-[65%]">
					<div className="relative">
						<div className="w-12 h-8 bg-red-500 rounded-l-full rounded-r-md relative">
							<div className="absolute top-2 left-3 w-2 h-2 bg-white rounded-full"></div>
							<div className="absolute top-2 left-4 w-1 h-1 bg-black rounded-full"></div>
							<div className="absolute -top-2 right-2 w-4 h-4 bg-red-500 transform rotate-45"></div>
							<div className="absolute -bottom-2 right-2 w-4 h-4 bg-red-500 transform -rotate-45"></div>
						</div>
					</div>
				</div>

				{/* Coins in air */}
				<div className="absolute bottom-[50%] left-[15%] flex space-x-4">
					<div className="w-6 h-8 bg-yellow-400 rounded-full border-2 border-yellow-600"></div>
					<div className="w-6 h-8 bg-yellow-400 rounded-full border-2 border-yellow-600"></div>
					<div className="w-6 h-8 bg-yellow-400 rounded-full border-2 border-yellow-600"></div>
				</div>

				{/* Floating platform (wooden) */}
				<div className="absolute bottom-[45%] left-[50%]">
					<div className="flex">
						<div className="w-10 h-10 bg-yellow-800 border-2 border-yellow-900 rounded-sm"></div>
						<div className="w-10 h-10 bg-yellow-800 border-2 border-yellow-900 rounded-sm"></div>
						<div className="w-10 h-10 bg-yellow-800 border-2 border-yellow-900 rounded-sm"></div>
					</div>
				</div>

				{/* Beach ball (like a Super Mario power-up) */}
				<div className="absolute bottom-[10%] left-[80%]">
					<div className="w-12 h-12 bg-white rounded-full relative">
						<div
							className="absolute inset-0 bg-red-500 rounded-full"
							style={{
								clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
							}}
						></div>
					</div>
				</div>

				{/* Palm tree */}
				<div className="absolute bottom-[8%] left-[60%]">
					<div className="w-6 h-20 bg-yellow-800 relative">
						<div className="absolute -top-2 -left-6 w-8 h-14 bg-green-600 rounded-full transform -rotate-45"></div>
						<div className="absolute -top-4 -left-2 w-10 h-12 bg-green-600 rounded-full"></div>
						<div className="absolute -top-2 left-4 w-8 h-14 bg-green-600 rounded-full transform rotate-45"></div>
					</div>
				</div>

				{/* Shy Guy on beach towel */}
				<div className="absolute bottom-[10%] left-[35%]">
					<div className="w-16 h-4 bg-blue-400 rounded-sm"></div>
					<div className="relative -top-6 left-3">
						<div className="w-10 h-6 bg-red-500 rounded-md"></div>
						<div className="absolute -top-3 left-0 w-10 h-3 bg-white rounded-t-md"></div>
						<div className="absolute top-0 left-2 w-2 h-2 bg-black rounded-full"></div>
						<div className="absolute top-0 left-6 w-2 h-2 bg-black rounded-full"></div>
					</div>
				</div>

				{/* Seashell */}
				<div className="absolute bottom-[5%] left-[10%]">
					<div className="w-8 h-6 bg-pink-200 rounded-l-full relative">
						<div className="absolute inset-x-0 bottom-0 h-3 bg-pink-300 rounded-b-full"></div>
					</div>
				</div>

				{/* Small Goomba with sunglasses */}
				<div className="absolute bottom-[15%] left-[75%]">
					<div className="relative">
						<div className="w-8 h-8 bg-brown-500 rounded-md"></div>
						<div className="absolute top-1 left-0 w-8 h-2 bg-black"></div>
						<div className="absolute bottom-1 left-2 w-4 h-1 bg-black"></div>
					</div>
				</div>
			</div>

			{/* Content container */}
			<div className="relative z-10 min-h-screen">{children}</div>
		</div>
	);
};

export default EnvironmentBeachLayers;
