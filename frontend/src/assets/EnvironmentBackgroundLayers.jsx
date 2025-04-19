import React from "react";
import { motion } from "framer-motion";

const EnvironmentBackgroundLayers = ({ children }) => {
	return (
		<div className="relative min-h-screen w-full overflow-hidden">
			{/* Sky gradient background */}
			<div className="absolute inset-0 z-[-5] bg-gradient-to-b from-blue-400 via-sky-400 to-cyan-300"></div>

			{/* Animated clouds */}
			<div className="absolute inset-0 z-[-4] pointer-events-none">
				{/* Large cloud 1 */}
				<motion.div 
					className="absolute top-[10%] left-[15%]"
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
					<div className="w-20 h-10 sm:w-28 sm:h-14 bg-white rounded-full opacity-90 relative">
						<div className="absolute -top-4 left-4 w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full"></div>
						<div className="absolute -top-2 -right-2 w-10 h-10 sm:w-14 sm:h-14 bg-white rounded-full"></div>
					</div>
				</motion.div>

				{/* Large cloud 2 */}
				<motion.div 
					className="absolute top-[20%] left-[70%] scale-75 sm:scale-90"
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
					<div className="w-24 h-12 sm:w-32 sm:h-16 bg-white rounded-full opacity-80 relative">
						<div className="absolute -top-5 left-5 w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full"></div>
						<div className="absolute -top-3 right-0 w-14 h-14 sm:w-18 sm:h-18 bg-white rounded-full"></div>
					</div>
				</motion.div>

				{/* Medium cloud 1 */}
				<motion.div 
					className="absolute top-[5%] left-[50%] scale-50"
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
					<div className="w-16 h-8 bg-white rounded-full opacity-85 relative">
						<div className="absolute -top-3 left-3 w-10 h-10 bg-white rounded-full"></div>
					</div>
				</motion.div>

				{/* Medium cloud 2 */}
				<motion.div 
					className="absolute top-[15%] left-[30%] scale-60"
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
					<div className="w-18 h-9 bg-white rounded-full opacity-75 relative">
						<div className="absolute -top-4 left-4 w-12 h-12 bg-white rounded-full"></div>
						<div className="absolute -top-2 -right-2 w-10 h-10 bg-white rounded-full"></div>
					</div>
				</motion.div>

				{/* Small cloud 1 */}
				<motion.div 
					className="absolute top-[25%] left-[80%] scale-40"
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
					<div className="w-12 h-6 bg-white rounded-full opacity-70 relative">
						<div className="absolute -top-2 left-2 w-8 h-8 bg-white rounded-full"></div>
					</div>
				</motion.div>

				{/* Small cloud 2 */}
				<motion.div 
					className="absolute top-[8%] left-[85%] scale-45"
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
					<div className="w-14 h-7 bg-white rounded-full opacity-65 relative">
						<div className="absolute -top-3 left-3 w-9 h-9 bg-white rounded-full"></div>
					</div>
				</motion.div>
			</div>

			{/* Ground layers */}
			<div
				className="absolute bottom-0 left-0 right-0 h-[60%] z-[-3] bg-gradient-to-t from-lime-400 via-lime-300 to-transparent opacity-80"
				style={{
					clipPath:
						"polygon(0 25%, 15% 15%, 30% 22%, 50% 12%, 70% 20%, 85% 10%, 100% 18%, 100% 100%, 0% 100%)",
				}}
			></div>
			<div
				className="absolute bottom-0 left-0 right-0 h-2/5 z-[-2] bg-gradient-to-t from-lime-500 to-lime-400"
				style={{
					clipPath:
						"polygon(0 45%, 20% 30%, 45% 40%, 65% 25%, 80% 35%, 100% 30%, 100% 100%, 0% 100%)",
				}}
			></div>
			<div className="absolute bottom-0 left-0 right-0 h-1/4 z-[-1] bg-green-600"></div>

			{/* Trees and vegetation */}
			<div className="absolute bottom-0 left-0 right-0 h-1/3 z-0 pointer-events-none">
				{/* Tree 1 */}
				<div className="absolute bottom-[calc(25%-5px)] left-[15%]">
					<div className="relative flex flex-col items-center">
						<div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-700 rounded-full border-2 border-green-900 shadow-md"></div>
						<div className="w-3 h-10 sm:w-4 sm:h-12 bg-yellow-800 -mt-1 rounded-b-sm"></div>
					</div>
				</div>

				{/* Tree 2 */}
				<div className="absolute bottom-[calc(25%-5px)] left-[75%]">
					<div className="relative flex flex-col items-center">
						<div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-800 rounded-full border-2 border-green-900 shadow-md"></div>
						<div className="w-2 h-8 sm:w-3 sm:h-10 bg-yellow-900 -mt-1 rounded-b-sm"></div>
					</div>
				</div>

				{/* Tree 3 */}
				<div className="absolute bottom-[calc(40%-20px)] left-[40%] scale-75">
					<div className="relative flex flex-col items-center opacity-90">
						<div className="w-10 h-10 bg-lime-600 rounded-full border-2 border-lime-800"></div>
						<div className="w-2 h-8 bg-yellow-900 -mt-1 rounded-b-sm"></div>
					</div>
				</div>

				{/* Tree 4 */}
				<div className="absolute bottom-[calc(25%-5px)] left-[30%]">
					<div className="w-10 h-6 sm:w-14 sm:h-8 bg-green-700 rounded-t-full"></div>
				</div>

				{/* Tree 5 */}
				<div className="absolute bottom-[calc(25%-5px)] left-[60%] scale-75">
					<div className="w-10 h-6 sm:w-14 sm:h-8 bg-green-700 rounded-t-full opacity-95"></div>
				</div>

				{/* Tree 6 */}
				<div className="absolute bottom-[calc(35%-10px)] left-[20%] scale-90">
					<div className="relative flex flex-col items-center">
						<div className="w-14 h-14 sm:w-18 sm:h-18 bg-green-600 rounded-full border-2 border-green-800 shadow-md"></div>
						<div className="w-3 h-12 sm:w-4 sm:h-14 bg-yellow-700 -mt-1 rounded-b-sm"></div>
					</div>
				</div>

				{/* Tree 7 */}
				<div className="absolute bottom-[calc(30%-5px)] left-[50%] scale-85">
					<div className="relative flex flex-col items-center">
						<div className="w-11 h-11 sm:w-14 sm:h-14 bg-green-700 rounded-full border-2 border-green-900 shadow-md"></div>
						<div className="w-2 h-10 sm:w-3 sm:h-12 bg-yellow-800 -mt-1 rounded-b-sm"></div>
					</div>
				</div>

				{/* Tree 8 */}
				<div className="absolute bottom-[calc(45%-25px)] left-[70%] scale-80">
					<div className="relative flex flex-col items-center opacity-85">
						<div className="w-9 h-9 bg-lime-500 rounded-full border-2 border-lime-700"></div>
						<div className="w-2 h-8 bg-yellow-800 -mt-1 rounded-b-sm"></div>
					</div>
				</div>

				{/* Tree 9 */}
				<div className="absolute bottom-[calc(25%-5px)] left-[85%]">
					<div className="w-12 h-7 sm:w-16 sm:h-9 bg-green-600 rounded-t-full"></div>
				</div>

				{/* Tree 10 */}
				<div className="absolute bottom-[calc(25%-5px)] left-[5%] scale-70">
					<div className="w-8 h-5 sm:w-12 sm:h-7 bg-green-700 rounded-t-full opacity-90"></div>
				</div>
			</div>

			{/* Content container */}
			<div className="relative z-10 min-h-screen">{children}</div>
		</div>
	);
};

export default EnvironmentBackgroundLayers;
