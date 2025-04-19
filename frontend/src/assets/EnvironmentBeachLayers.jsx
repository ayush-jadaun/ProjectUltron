import React from "react";

const EnvironmentBeachLayers = ({ children }) => {
	return (
		<div className="relative min-h-screen w-full overflow-hidden">
			{/* Sunny sky background */}
			<div className="absolute inset-0 z-[-5] bg-gradient-to-b from-blue-300 via-blue-200 to-blue-100"></div>

			{/* Sun */}
			<div className="absolute top-[5%] left-[15%] z-[-4]">
				<div className="w-20 h-20 sm:w-24 sm:h-24 bg-yellow-300 rounded-full opacity-90 shadow-lg"></div>
			</div>

			{/* Fluffy clouds */}
			<div className="absolute inset-0 z-[-4] pointer-events-none">
				{/* Large fluffy cloud */}
				<div className="absolute top-[10%] right-[15%]">
					<div className="w-20 h-10 sm:w-28 sm:h-14 bg-white rounded-full opacity-95 relative">
						<div className="absolute -top-4 left-4 w-14 h-14 sm:w-18 sm:h-18 bg-white rounded-full"></div>
						<div className="absolute -top-2 -right-1 w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full"></div>
						<div className="absolute top-0 left-10 w-10 h-10 sm:w-14 sm:h-14 bg-white rounded-full"></div>
					</div>
				</div>
				{/* Medium cloud */}
				<div className="absolute top-[20%] left-[60%] scale-90">
					<div className="w-20 h-10 sm:w-24 sm:h-12 bg-white rounded-full opacity-90 relative">
						<div className="absolute -top-3 left-3 w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full"></div>
						<div className="absolute -top-1 right-2 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full"></div>
					</div>
				</div>
				{/* Small cloud */}
				<div className="absolute top-[8%] left-[35%] scale-75">
					<div className="w-16 h-8 bg-white rounded-full opacity-85 relative">
						<div className="absolute -top-3 left-3 w-10 h-10 bg-white rounded-full"></div>
						<div className="absolute top-0 left-8 w-8 h-8 bg-white rounded-full"></div>
					</div>
				</div>
			</div>

			{/* Far ocean background */}
			<div
				className="absolute bottom-0 left-0 right-0 h-[40%] z-[-3] bg-gradient-to-t from-blue-500 via-blue-400 to-transparent opacity-80"
				style={{
					clipPath:
						"polygon(0 70%, 5% 72%, 10% 68%, 15% 73%, 20% 68%, 25% 74%, 30% 69%, 35% 73%, 40% 68%, 45% 72%, 50% 68%, 55% 73%, 60% 69%, 65% 74%, 70% 70%, 80% 68%, 90% 72%, 95% 68%, 100% 70%, 100% 100%, 0% 100%)",
				}}
			></div>

			{/* Mid-ground ocean waves */}
			<div
				className="absolute bottom-0 left-0 right-0 h-[35%] z-[-2] bg-gradient-to-t from-blue-400 to-blue-300"
				style={{
					clipPath:
						"polygon(0 80%, 8% 77%, 12% 82%, 18% 78%, 25% 83%, 32% 78%, 40% 83%, 48% 78%, 55% 84%, 62% 79%, 70% 85%, 78% 80%, 85% 85%, 92% 79%, 100% 83%, 100% 100%, 0% 100%)",
					animation: "wavesMoving 8s infinite alternate",
				}}
			></div>

			{/* Foreground beach sand */}
			<div
				className="absolute bottom-0 left-0 right-0 h-[25%] z-[-1] bg-gradient-to-t from-yellow-200 to-yellow-100"
				style={{
					clipPath:
						"polygon(0 90%, 6% 88%, 13% 92%, 20% 88%, 27% 94%, 34% 89%, 42% 93%, 50% 89%, 58% 95%, 65% 90%, 73% 96%, 80% 91%, 88% 95%, 95% 90%, 100% 93%, 100% 100%, 0% 100%)",
				}}
			></div>

			{/* Sand texture */}
			<div className="absolute bottom-0 left-0 right-0 h-1/5 z-0 bg-yellow-100"></div>

			{/* Mario theme beach elements */}
			<div className="absolute bottom-0 left-0 right-0 h-2/3 z-10 pointer-events-none">
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
			<div className="relative z-20 min-h-screen">{children}</div>

			{/* CSS for animations */}
			<style jsx>{`
				@keyframes wavesMoving {
					0% {
						transform: translateX(-1%);
					}
					100% {
						transform: translateX(1%);
					}
				}
			`}</style>
		</div>
	);
};

export default EnvironmentBeachLayers;
