import React from "react";
import { motion } from "framer-motion";

const EnvironmentFloodingLayers = ({ children }) => {
	return (
		<div className="relative min-h-screen w-full overflow-hidden">
			{/* Sky gradient background */}
			<div className="absolute inset-0 z-[-5] bg-gradient-to-b from-sky-100 via-sky-200 to-sky-300"></div>

			{/* Animated clouds */}
			<div className="absolute inset-0 z-[-4] pointer-events-none">
				{/* Large cloud 1 */}
				<motion.div 
					className="absolute top-[5%] left-[10%]"
					animate={{
						x: [0, 15, 0],
						y: [0, -5, 0],
						opacity: [0.9, 0.7, 0.9]
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
					className="absolute top-[15%] left-[60%] scale-90"
					animate={{
						x: [0, -20, 0],
						y: [0, 5, 0],
						opacity: [0.85, 0.65, 0.85]
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
					className="absolute top-[8%] left-[35%] scale-75"
					animate={{
						x: [0, 10, 0],
						y: [0, -3, 0],
						opacity: [0.8, 0.6, 0.8]
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
					className="absolute top-[25%] left-[20%] scale-80"
					animate={{
						x: [0, -15, 0],
						y: [0, 4, 0],
						opacity: [0.75, 0.55, 0.75]
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
					className="absolute top-[12%] left-[80%] scale-50"
					animate={{
						x: [0, 8, 0],
						y: [0, -2, 0],
						opacity: [0.7, 0.5, 0.7]
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
					className="absolute top-[30%] left-[45%] scale-60"
					animate={{
						x: [0, -10, 0],
						y: [0, 3, 0],
						opacity: [0.65, 0.45, 0.65]
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
					className="absolute top-[18%] left-[70%] scale-40"
					animate={{
						x: [0, 5, 0],
						y: [0, -1, 0],
						opacity: [0.6, 0.4, 0.6]
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
					className="absolute top-[22%] left-[15%] scale-45"
					animate={{
						x: [0, -7, 0],
						y: [0, 2, 0],
						opacity: [0.55, 0.35, 0.55]
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
			</div>

			{/* Distant submerged houses - furthest back */}
			<div
				className="absolute bottom-0 left-0 right-0 h-[50%] z-[-3] bg-gradient-to-t from-blue-700 via-blue-600 to-transparent opacity-80"
				style={{
					clipPath:
						"polygon(0 70%, 5% 65%, 10% 72%, 15% 65%, 20% 75%, 25% 65%, 30% 75%, 35% 70%, 40% 60%, 45% 70%, 50% 60%, 55% 70%, 60% 65%, 65% 75%, 70% 60%, 80% 70%, 90% 60%, 95% 70%, 100% 65%, 100% 100%, 0% 100%)",
				}}
			></div>

			{/* Mid-ground floating debris */}
			<div
				className="absolute bottom-0 left-0 right-0 h-[40%] z-[-2] bg-gradient-to-t from-blue-600 to-blue-500"
				style={{
					clipPath:
						"polygon(0 75%, 8% 72%, 12% 80%, 18% 75%, 25% 85%, 32% 75%, 40% 85%, 48% 75%, 55% 80%, 62% 75%, 70% 85%, 78% 75%, 85% 85%, 92% 75%, 100% 80%, 100% 100%, 0% 100%)",
				}}
			></div>

			{/* Foreground rising water - closest to viewer */}
			<div
				className="absolute bottom-0 left-0 right-0 h-[30%] z-[-1] bg-gradient-to-t from-blue-500 to-blue-400"
				style={{
					clipPath:
						"polygon(0 85%, 6% 80%, 13% 90%, 20% 80%, 27% 95%, 34% 85%, 42% 95%, 50% 85%, 58% 95%, 65% 85%, 73% 95%, 80% 85%, 88% 95%, 95% 85%, 100% 90%, 100% 100%, 0% 100%)",
					animation: "waterRise 20s infinite alternate",
				}}
			></div>

			{/* Water base */}
			<div className="absolute bottom-0 left-0 right-0 h-1/4 z-0 bg-gradient-to-t from-blue-700 to-blue-500"></div>

			{/* Mario theme elements */}
			<div className="absolute bottom-0 left-0 right-0 h-2/3 z-10 pointer-events-none">
				{/* Block with question mark */}
				<div className="absolute bottom-[40%] left-[25%]">
					<div className="w-12 h-12 sm:w-16 sm:h-16 bg-yellow-300 rounded-md border-2 border-yellow-600 shadow-md flex items-center justify-center">
						<span className="text-xl sm:text-2xl font-bold text-yellow-600">
							?
						</span>
					</div>
				</div>

				{/* Floating wooden platform */}
				<div className="absolute bottom-[35%] left-[40%]">
					<div className="flex">
						<div className="w-10 h-10 bg-yellow-800 border-2 border-yellow-900 rounded-sm"></div>
						<div className="w-10 h-10 bg-yellow-800 border-2 border-yellow-900 rounded-sm"></div>
						<div className="w-10 h-10 bg-yellow-800 border-2 border-yellow-900 rounded-sm"></div>
					</div>
				</div>

				{/* Cheep Cheep fish (simplified) */}
				<div className="absolute bottom-[22%] left-[65%]">
					<div className="relative">
						<div className="w-12 h-8 bg-red-500 rounded-l-full rounded-r-md relative">
							<div className="absolute top-2 left-3 w-2 h-2 bg-white rounded-full"></div>
							<div className="absolute top-2 left-4 w-1 h-1 bg-black rounded-full"></div>
							<div className="absolute -top-2 right-2 w-4 h-4 bg-red-500 transform rotate-45"></div>
							<div className="absolute -bottom-2 right-2 w-4 h-4 bg-red-500 transform -rotate-45"></div>
						</div>
					</div>
				</div>

				{/* Coins */}
				<div className="absolute bottom-[45%] left-[15%] flex space-x-4">
					<div className="w-6 h-8 bg-yellow-400 rounded-full border-2 border-yellow-600"></div>
					<div className="w-6 h-8 bg-yellow-400 rounded-full border-2 border-yellow-600"></div>
					<div className="w-6 h-8 bg-yellow-400 rounded-full border-2 border-yellow-600"></div>
				</div>

				{/* Fire Flower (power-up) */}
				<div className="absolute bottom-[50%] left-[80%]">
					<div className="relative">
						<div className="w-8 h-3 bg-green-600"></div>
						<div className="w-6 h-6 bg-red-500 rounded-full absolute -top-6 left-1"></div>
						<div className="w-4 h-4 bg-white rounded-full absolute -top-5 left-2"></div>
					</div>
				</div>

				{/* Floating debris */}
				<div className="absolute bottom-[30%] left-[30%] flex space-x-4">
					<div className="w-8 h-3 bg-yellow-700 rounded-md"></div>
					<div className="w-5 h-2 bg-yellow-800 rounded-md"></div>
					<div className="w-6 h-4 bg-yellow-700 rounded-md"></div>
				</div>

				{/* Pipe sticking out of water */}
				<div className="absolute bottom-[15%] left-[50%]">
					<div className="w-12 h-16 bg-green-500 relative">
						<div className="absolute top-0 w-16 h-4 bg-green-600 -left-2"></div>
					</div>
				</div>

				{/* Small Goomba on floating platform */}
				<div className="absolute bottom-[55%] left-[10%]">
					<div className="w-8 h-3 bg-yellow-800 rounded-md"></div>
					<div className="relative -top-6 left-1">
						<div className="w-6 h-6 bg-brown-500 rounded-md"></div>
						<div className="absolute top-1 left-1 w-1 h-1 bg-black rounded-full"></div>
						<div className="absolute top-1 left-4 w-1 h-1 bg-black rounded-full"></div>
						<div className="absolute bottom-1 left-2 w-2 h-1 bg-black"></div>
					</div>
				</div>

				{/* Lifebuoy */}
				<div className="absolute bottom-[25%] left-[70%]">
					<div className="w-10 h-10 bg-red-500 rounded-full relative">
						<div className="absolute top-2 left-2 w-6 h-6 bg-white rounded-full"></div>
					</div>
				</div>
			</div>

			{/* Content container */}
			<div className="relative z-20 min-h-screen">{children}</div>

			{/* CSS for animations */}
			<style jsx>{`
				@keyframes waterRise {
					0% {
						height: 30%;
					}
					100% {
						height: 40%;
					}
				}
			`}</style>
		</div>
	);
};

export default EnvironmentFloodingLayers;
