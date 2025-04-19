import React from "react";

const EnvironmentIcebergLayers = ({ children }) => {
	return (
		<div className="relative min-h-screen w-full overflow-hidden">
			{/* Deep blue sky background */}
			<div className="absolute inset-0 z-[-5] bg-gradient-to-b from-blue-600 via-blue-500 to-blue-400"></div>

			{/* Distant snow clouds */}
			<div className="absolute inset-0 z-[-4] pointer-events-none">
				{/* Large fluffy snow cloud */}
				<div className="absolute top-[8%] left-[20%]">
					<div className="w-20 h-10 sm:w-28 sm:h-14 bg-white rounded-full opacity-95 relative">
						<div className="absolute -top-4 left-4 w-14 h-14 sm:w-18 sm:h-18 bg-white rounded-full"></div>
						<div className="absolute -top-2 -right-1 w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full"></div>
						<div className="absolute top-0 left-10 w-10 h-10 sm:w-14 sm:h-14 bg-white rounded-full"></div>
					</div>
				</div>
				{/* Medium snow cloud */}
				<div className="absolute top-[15%] left-[65%] scale-90">
					<div className="w-20 h-10 sm:w-24 sm:h-12 bg-white rounded-full opacity-90 relative">
						<div className="absolute -top-3 left-3 w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full"></div>
						<div className="absolute -top-1 right-2 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full"></div>
					</div>
				</div>
				{/* Small snow cloud */}
				<div className="absolute top-[5%] left-[40%] scale-60">
					<div className="w-16 h-8 bg-white rounded-full opacity-85 relative">
						<div className="absolute -top-3 left-3 w-10 h-10 bg-white rounded-full"></div>
						<div className="absolute top-0 left-8 w-8 h-8 bg-white rounded-full"></div>
					</div>
				</div>
			</div>

			{/* Background icebergs - furthest back */}
			<div
				className="absolute bottom-0 left-0 right-0 h-[50%] z-[-3] bg-gradient-to-t from-cyan-100 via-blue-50 to-transparent opacity-80"
				style={{
					clipPath:
						"polygon(0 40%, 8% 35%, 15% 42%, 22% 30%, 30% 45%, 38% 25%, 46% 38%, 54% 28%, 62% 40%, 70% 30%, 80% 45%, 88% 30%, 95% 40%, 100% 35%, 100% 100%, 0% 100%)",
				}}
			></div>

			{/* Mid-ground icebergs */}
			<div
				className="absolute bottom-0 left-0 right-0 h-[40%] z-[-2] bg-gradient-to-t from-cyan-200 to-blue-100"
				style={{
					clipPath:
						"polygon(0 50%, 5% 42%, 12% 55%, 18% 38%, 25% 60%, 32% 45%, 40% 58%, 48% 40%, 55% 52%, 62% 38%, 70% 55%, 78% 42%, 85% 58%, 92% 45%, 100% 52%, 100% 100%, 0% 100%)",
				}}
			></div>

			{/* Foreground icebergs - closest to viewer */}
			<div
				className="absolute bottom-0 left-0 right-0 h-[30%] z-[-1] bg-gradient-to-t from-cyan-300 to-cyan-200"
				style={{
					clipPath:
						"polygon(0 60%, 6% 50%, 13% 65%, 20% 48%, 27% 70%, 34% 55%, 42% 68%, 50% 50%, 58% 62%, 65% 48%, 73% 65%, 80% 52%, 88% 68%, 95% 55%, 100% 62%, 100% 100%, 0% 100%)",
				}}
			></div>

			{/* Water base */}
			<div className="absolute bottom-0 left-0 right-0 h-1/5 z-0 bg-gradient-to-t from-blue-700 to-blue-500"></div>

			{/* Mario theme elements */}
			<div className="absolute bottom-0 left-0 right-0 h-2/3 z-10 pointer-events-none">
				{/* Ice block with question mark */}
				<div className="absolute bottom-[20%] left-[25%]">
					<div className="w-12 h-12 sm:w-16 sm:h-16 bg-yellow-300 rounded-md border-2 border-yellow-600 shadow-md flex items-center justify-center">
						<span className="text-xl sm:text-2xl font-bold text-yellow-600">
							?
						</span>
					</div>
				</div>

				{/* Ice platform with blocks */}
				<div className="absolute bottom-[35%] left-[40%]">
					<div className="flex">
						<div className="w-10 h-10 bg-cyan-100 border-2 border-cyan-300 rounded-sm"></div>
						<div className="w-10 h-10 bg-cyan-100 border-2 border-cyan-300 rounded-sm"></div>
						<div className="w-10 h-10 bg-cyan-100 border-2 border-cyan-300 rounded-sm"></div>
					</div>
				</div>

				{/* Penguin (simplified) */}
				<div className="absolute bottom-[22%] left-[65%]">
					<div className="relative">
						<div className="w-12 h-14 bg-blue-900 rounded-t-full rounded-b-lg relative">
							<div className="absolute top-2 left-3 w-6 h-8 bg-white rounded-t-full rounded-b-lg"></div>
							<div className="absolute top-4 left-5 w-1 h-1 bg-black rounded-full"></div>
							<div className="absolute top-4 left-7 w-1 h-1 bg-black rounded-full"></div>
							<div className="absolute bottom-2 left-3 w-6 h-2 bg-yellow-400 rounded-md"></div>
						</div>
					</div>
				</div>

				{/* Coins */}
				<div className="absolute bottom-[45%] left-[15%] flex space-x-4">
					<div className="w-6 h-8 bg-yellow-400 rounded-full border-2 border-yellow-600"></div>
					<div className="w-6 h-8 bg-yellow-400 rounded-full border-2 border-yellow-600"></div>
					<div className="w-6 h-8 bg-yellow-400 rounded-full border-2 border-yellow-600"></div>
				</div>

				{/* Ice Flowers (power-up) */}
				<div className="absolute bottom-[30%] left-[80%]">
					<div className="relative">
						<div className="w-8 h-3 bg-green-600"></div>
						<div className="w-6 h-6 bg-cyan-400 rounded-full absolute -top-6 left-1"></div>
						<div className="w-4 h-4 bg-white rounded-full absolute -top-5 left-2"></div>
					</div>
				</div>

				{/* Hanging icicles */}
				<div className="absolute top-[45%] left-[30%] flex space-x-4">
					<div
						className="w-3 h-12 bg-blue-100 opacity-80"
						style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
					></div>
					<div
						className="w-2 h-8 bg-blue-100 opacity-80"
						style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
					></div>
					<div
						className="w-4 h-10 bg-blue-100 opacity-80"
						style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
					></div>
				</div>

				{/* Floating ice platform */}
				<div className="absolute bottom-[15%] left-[50%]">
					<div className="w-16 h-4 bg-cyan-200 rounded-md border-2 border-cyan-300 shadow-md"></div>
				</div>
			</div>

			{/* Content container */}
			<div className="relative z-20 min-h-screen">{children}</div>
		</div>
	);
};

export default EnvironmentIcebergLayers;
