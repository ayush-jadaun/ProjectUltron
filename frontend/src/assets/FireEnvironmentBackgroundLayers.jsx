import React from "react";

const FireEnvironmentBackgroundLayers = ({ children }) => {
	return (
		<div className="relative min-h-screen w-full overflow-hidden">
			{/* Sky gradient background */}
			<div className="absolute inset-0 z-[-5] bg-gradient-to-b from-amber-200 via-orange-200 to-red-200"></div>

			{/* Clouds with warm tint */}
			<div className="absolute inset-0 z-[-4] pointer-events-none">
				<div className="absolute top-[8%] left-[12%]">
					<div className="w-20 h-10 sm:w-28 sm:h-14 bg-white/90 rounded-full opacity-90 relative">
						<div className="absolute -top-4 left-4 w-12 h-12 sm:w-16 sm:h-16 bg-white/90 rounded-full"></div>
						<div className="absolute -top-2 -right-2 w-10 h-10 sm:w-14 sm:h-14 bg-white/90 rounded-full"></div>
					</div>
				</div>
				<div className="absolute top-[18%] left-[65%] scale-75 sm:scale-90">
					<div className="w-24 h-12 sm:w-32 sm:h-16 bg-white/80 rounded-full opacity-80 relative">
						<div className="absolute -top-5 left-5 w-16 h-16 sm:w-20 sm:h-20 bg-white/80 rounded-full"></div>
						<div className="absolute -top-3 right-0 w-14 h-14 sm:w-18 sm:h-18 bg-white/80 rounded-full"></div>
					</div>
				</div>
				<div className="absolute top-[5%] left-[45%] scale-50">
					<div className="w-16 h-8 bg-white/85 rounded-full opacity-85 relative">
						<div className="absolute -top-3 left-3 w-10 h-10 bg-white/85 rounded-full"></div>
					</div>
				</div>
			</div>

			{/* Lava/Fire layer 1 */}
			<div
				className="absolute bottom-0 left-0 right-0 h-[60%] z-[-3] bg-gradient-to-t from-orange-400 via-orange-300 to-transparent opacity-90"
				style={{
					clipPath:
						"polygon(0 35%, 15% 25%, 30% 32%, 50% 22%, 70% 30%, 85% 20%, 100% 28%, 100% 100%, 0% 100%)",
				}}
			></div>

			{/* Lava/Fire layer 2 */}
			<div
				className="absolute bottom-0 left-0 right-0 h-2/5 z-[-2] bg-gradient-to-t from-red-400 to-orange-400"
				style={{
					clipPath:
						"polygon(0 45%, 20% 30%, 45% 40%, 65% 25%, 80% 35%, 100% 30%, 100% 100%, 0% 100%)",
				}}
			></div>

			{/* Base ground layer */}
			<div className="absolute bottom-0 left-0 right-0 h-1/4 z-[-1] bg-red-600"></div>

			{/* Mario-style elements */}
			<div className="absolute bottom-0 left-0 right-0 h-1/3 z-0 pointer-events-none">
				{/* Flame 1 */}
				<div className="absolute bottom-[calc(25%-5px)] left-[15%]">
					<div className="relative flex flex-col items-center">
						<div className="w-12 h-16 sm:w-16 sm:h-20 bg-yellow-500 rounded-t-full border-2 border-orange-500 shadow-md animate-pulse"></div>
						<div className="absolute top-4 left-2 w-8 h-10 sm:w-10 sm:h-12 bg-red-500/70 rounded-t-full"></div>
					</div>
				</div>

				{/* Flame 2 */}
				<div className="absolute bottom-[calc(25%-5px)] left-[75%]">
					<div className="relative flex flex-col items-center">
						<div className="w-10 h-14 sm:w-12 sm:h-16 bg-yellow-400 rounded-t-full border-2 border-orange-500 shadow-md animate-pulse"></div>
						<div className="absolute top-3 left-1 w-6 h-8 sm:w-8 sm:h-10 bg-red-400/70 rounded-t-full"></div>
					</div>
				</div>

				{/* Small flame */}
				<div className="absolute bottom-[calc(40%-20px)] left-[40%] scale-75">
					<div className="relative flex flex-col items-center opacity-90 animate-pulse">
						<div className="w-10 h-12 bg-yellow-300 rounded-t-full border-2 border-orange-400"></div>
						<div className="absolute top-2 left-1 w-6 h-7 bg-red-300/70 rounded-t-full"></div>
					</div>
				</div>

				{/* Fire blocks similar to Mario */}
				<div className="absolute bottom-[calc(25%-5px)] left-[30%]">
					<div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500 rounded-lg border-t-2 border-l-2 border-yellow-400 border-r-2 border-b-2 border-orange-700 flex items-center justify-center">
						<div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-300 rounded-sm"></div>
					</div>
				</div>

				<div className="absolute bottom-[calc(25%-5px)] left-[60%] scale-75">
					<div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500 rounded-lg border-t-2 border-l-2 border-yellow-400 border-r-2 border-b-2 border-orange-700 flex items-center justify-center opacity-95">
						<div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-300 rounded-sm"></div>
					</div>
				</div>

				{/* Small eruption */}
				<div className="absolute bottom-[calc(30%)] left-[50%]">
					<div className="relative flex flex-col items-center">
						<div className="w-6 h-12 bg-gradient-to-t from-red-500 to-yellow-300 rounded-full animate-bounce"></div>
						<div className="w-8 h-4 bg-red-600 rounded-t-full -mt-2"></div>
					</div>
				</div>
			</div>

			{/* Content container */}
			<div className="relative z-10 min-h-screen">{children}</div>
		</div>
	);
};

export default FireEnvironmentBackgroundLayers;
