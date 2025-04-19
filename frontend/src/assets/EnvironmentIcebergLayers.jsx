import React from "react";
import { motion } from "framer-motion";

const EnvironmentIcebergLayers = ({ children }) => {
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

			{/* Iceberg layers */}
			<div className="absolute bottom-0 left-0 right-0 h-[60%] z-[-3] bg-gradient-to-t from-blue-100 via-blue-50 to-transparent opacity-90 shadow-inner"
				style={{
					clipPath: "polygon(0 25%, 15% 15%, 30% 22%, 50% 12%, 70% 20%, 85% 10%, 100% 18%, 100% 100%, 0% 100%)",
				}}
			></div>
			<div className="absolute bottom-0 left-0 right-0 h-2/5 z-[-2] bg-gradient-to-t from-blue-200 to-blue-100 shadow-lg"
				style={{
					clipPath: "polygon(0 45%, 20% 30%, 45% 40%, 65% 25%, 80% 35%, 100% 30%, 100% 100%, 0% 100%)",
				}}
			></div>
			<div className="absolute bottom-0 left-0 right-0 h-1/4 z-[-1] bg-blue-300 shadow-xl"></div>

			{/* Content container */}
			<div className="relative z-10 min-h-screen">{children}</div>
		</div>
	);
};

export default EnvironmentIcebergLayers;
