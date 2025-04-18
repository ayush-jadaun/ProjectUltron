// src/pages/HomePage.jsx (Assuming this path)

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux"; // Import Redux hooks
import { useNavigate } from "react-router-dom"; // Import navigation hook
import {
	MapPinIcon,
	BellIcon,
	Mail,
	PhoneIcon,
	CheckIcon,
	LogOut,
	LogIn,
	NavigationIcon, // Import icons for buttons
} from "lucide-react";
import { handleLogout } from "../store/slices/authSlice"; // Adjust path as needed

const HomePage = () => {
	// --- Existing State ---
	const [selectedRegions, setSelectedRegions] = useState([]);
	const [topics, setTopics] = useState({
		deforestation: false,
		airPollution: false,
		flooding: false,
		glacierMelting: false,
		urbanExpansion: false,
		coastalErosion: false,
	});
	const [notifyMethod, setNotifyMethod] = useState("email");
	const [contactInfo, setContactInfo] = useState("");
	// Removed viewState as it wasn't used in the provided snippet
	// const [viewState, setViewState] = useState({ latitude: 20.5937, longitude: 78.9629, zoom: 4 });
	const [isSaving, setIsSaving] = useState(false);
	const [saveSuccess, setSaveSuccess] = useState(false);

	// --- Redux State and Hooks ---
	const {
		isAuthenticated,
		user,
		loading: authLoading,
	} = useSelector((state) => state.auth); // Get auth state and user
	const dispatch = useDispatch();
	const navigate = useNavigate();

	// --- Data ---
	const regions = [
		{ id: 1, name: "Kerala", lat: 10.8505, lng: 76.2711 },
		{ id: 2, name: "Delhi", lat: 28.7041, lng: 77.1025 },
		{ id: 3, name: "Maharashtra", lat: 19.7515, lng: 75.7139 },
		{ id: 4, name: "Tamil Nadu", lat: 11.1271, lng: 78.6569 },
		{ id: 5, name: "Karnataka", lat: 15.3173, lng: 75.7139 },
	];

	// --- Handlers ---
	const handleRegionToggle = (region) => {
		if (selectedRegions.some((r) => r.id === region.id)) {
			setSelectedRegions(selectedRegions.filter((r) => r.id !== region.id));
		} else {
			setSelectedRegions([...selectedRegions, region]);
		}
	};

	const handleTopicToggle = (topic) => {
		setTopics({ ...topics, [topic]: !topics[topic] });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		// **Enhancement:** Check if user is authenticated before allowing save
		if (!isAuthenticated) {
			// Optionally show a message or redirect to login
			alert("Please log in to save your preferences.");
			navigate("/login"); // Redirect to login page
			return;
		}

		setIsSaving(true);

		// Prepare data for saving
		const preferenceData = {
			regions: selectedRegions.map((r) => r.name),
			topics: Object.keys(topics).filter((key) => topics[key]),
			notifyMethod: notifyMethod,
			contactInfo: contactInfo,
			userId: user?.id, // Get userId from the logged-in user state
		};

		// **TODO:** Replace simulation with actual API call to save preferences
		// Example: dispatch(saveUserPreferences(preferenceData));
		console.log(
			"Attempting to save preferences for user:",
			user?.id,
			preferenceData
		);

		// Simulate API call
		setTimeout(() => {
			console.log("Saved preferences:", preferenceData);
			setIsSaving(false);
			setSaveSuccess(true);
			setTimeout(() => setSaveSuccess(false), 3000);
		}, 1500);
	};

	// --- Navigation and Logout Handlers ---
	const onLoginClick = () => {
		navigate("/login"); // Navigate to your LoginSignup route
	};
	const onProfileClick = () => {
		navigate("/profile");
	};
	const onLogoutClick = () => {
		dispatch(handleLogout())
			.unwrap()
			.then(() => {
				// Optional: Show success message
				navigate("/"); // Navigate to home page after logout
			})
			.catch((err) => {
				console.error("Logout failed:", err);
				// Optional: Show error message
			});
	};

	// --- Effect to pre-fill contact info if user is logged in ---
	useEffect(() => {
		if (isAuthenticated && user) {
			if (notifyMethod === "email" && user.email) {
				setContactInfo(user.email);
			} else if (notifyMethod === "sms" && user.contact_number) {
				setContactInfo(user.contact_number);
			} else {
				setContactInfo(""); // Clear if method doesn't match available info
			}
		} else {
			setContactInfo(""); // Clear if not authenticated
		}
	}, [isAuthenticated, user, notifyMethod]);

	return (
		<div className="min-h-screen bg-gray-50">
			<header className="bg-green-700 text-white p-4 shadow-md sticky top-0 z-10">
				<div className="container mx-auto flex items-center justify-between">
					{/* Left side: Title */}
					<div className="flex items-center">
						<BellIcon className="mr-2 hidden sm:block" size={24} />{" "}
						{/* Hide icon on small screens */}
						<h1 className="text-xl font-bold">Ultron Alert</h1>
					</div>

					{/* Right side: Conditional Buttons */}
					<div>
						{isAuthenticated ? (
							// --- User is Logged In ---
							<div className="flex items-center space-x-3 sm:space-x-4">
								{/* Optional: Welcome message */}
								<button
									className="flex items-center px-3 py-2 sm:px-4 bg-green-900 text-white font-medium text-xs sm:text-sm rounded-lg shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
									onClick={onProfileClick}
								>
									{user?.name || user?.email}
								</button>
								<button
									onClick={onLogoutClick}
									disabled={authLoading} // Disable button during logout process
									className={`flex items-center px-3 py-2 sm:px-4 ${
										authLoading
											? "bg-orange-400 cursor-not-allowed"
											: "bg-orange-600 hover:bg-orange-700"
									} text-white font-medium text-xs sm:text-sm rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors`}
								>
									<LogOut size={16} className="mr-1" />
									Logout
								</button>
							</div>
						) : (
							// --- User is Logged Out ---
							<button
								onClick={onLoginClick}
								className="flex items-center px-3 py-2 sm:px-4 bg-green-900 text-white font-medium text-xs sm:text-sm rounded-lg shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
							>
								<LogIn size={16} className="mr-1" />
								Login / Sign Up
							</button>
						)}
					</div>
				</div>
			</header>

			<main className="container mx-auto py-8 px-4">
				<div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
					<h2 className="text-2xl font-bold mb-6 text-green-800 flex items-center">
						<BellIcon className="mr-2" size={24} />
						Set Up Environmental Alerts
					</h2>

					{!isAuthenticated && (
						<div className="mb-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded-md">
							<p className="font-medium">
								Please{" "}
								<button
									onClick={onLoginClick}
									className="font-bold underline hover:text-yellow-800"
								>
									log in
								</button>{" "}
								or{" "}
								<button
									onClick={onLoginClick}
									className="font-bold underline hover:text-yellow-800"
								>
									sign up
								</button>{" "}
								to save your alert preferences.
							</p>
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-8">
						{/* Region Selection */}
						<section>
							<h3 className="text-lg font-semibold mb-4 flex items-center text-gray-700">
								<MapPinIcon className="mr-2" size={20} />
								Select Regions to Monitor
							</h3>
							<div className="mb-6 h-64 border rounded-lg overflow-hidden bg-gray-100">
								{/* TODO: Replace with actual Map component (e.g., React Map GL, Leaflet) */}
								<div className="h-full flex items-center justify-center">
									<p className="text-gray-500 italic">
										Interactive map placeholder
									</p>
								</div>
							</div>
							<div className="flex flex-wrap gap-2 mt-4">
								{regions.map((region) => (
									<button
										key={region.id}
										type="button"
										onClick={() => handleRegionToggle(region)}
										className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
											selectedRegions.some((r) => r.id === region.id)
												? "bg-green-600 text-white ring-2 ring-green-300"
												: "bg-gray-100 text-gray-800 hover:bg-gray-200"
										}`}
									>
										{region.name}
										{selectedRegions.some((r) => r.id === region.id) && (
											<CheckIcon className="inline ml-1.5" size={16} />
										)}
									</button>
								))}
							</div>
						</section>

						{/* Topic Selection */}
						<section>
							<h3 className="text-lg font-semibold mb-4 text-gray-700">
								Choose Environmental Topics
							</h3>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
								{Object.keys(topics).map((key) => {
									const label = key
										.replace(/([A-Z])/g, " $1")
										.replace(/^./, (str) => str.toUpperCase());
									return (
										<label
											key={key}
											className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-gray-50"
										>
											<input
												type="checkbox"
												id={key}
												checked={topics[key]}
												onChange={() => handleTopicToggle(key)}
												className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
											/>
											<span className="text-gray-700 select-none">{label}</span>
										</label>
									);
								})}
							</div>
						</section>

						{/* Notification Method */}
						<section>
							<h3 className="text-lg font-semibold mb-4 text-gray-700">
								How Would You Like to Be Notified?
							</h3>
							<div className="flex flex-col sm:flex-row gap-4 mb-4">
								<label className="flex items-center cursor-pointer">
									<input
										type="radio"
										id="email"
										name="notifyMethod"
										value="email"
										checked={notifyMethod === "email"}
										onChange={() => setNotifyMethod("email")}
										className="h-4 w-4 border-gray-300 text-green-600 focus:ring-green-500"
									/>
									<span className="ml-2 flex items-center text-gray-700">
										<Mail size={16} className="mr-1" /> Email
									</span>
								</label>
								<label className="flex items-center cursor-pointer">
									<input
										type="radio"
										id="sms"
										name="notifyMethod"
										value="sms"
										checked={notifyMethod === "sms"}
										onChange={() => setNotifyMethod("sms")}
										className="h-4 w-4 border-gray-300 text-green-600 focus:ring-green-500"
									/>
									<span className="ml-2 flex items-center text-gray-700">
										<PhoneIcon size={16} className="mr-1" /> SMS
									</span>
								</label>
							</div>
							<div>
								<label
									htmlFor="contactInfo"
									className="block text-sm font-medium text-gray-700 mb-1"
								>
									{notifyMethod === "email"
										? "Email Address"
										: "Phone Number (with country code)"}
								</label>
								<input
									type={notifyMethod === "email" ? "email" : "tel"}
									id="contactInfo"
									value={contactInfo}
									onChange={(e) => setContactInfo(e.target.value)}
									placeholder={
										notifyMethod === "email"
											? "your.email@example.com"
											: "+911234567890"
									}
									className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm disabled:bg-gray-100"
									required
									disabled={!isAuthenticated} // Disable if not logged in
								/>
								{!isAuthenticated && (
									<p className="text-xs text-gray-500 mt-1">
										Log in to enter contact details.
									</p>
								)}
							</div>
						</section>

						{/* Submit Button */}
						<div className="flex items-center justify-between pt-4 border-t">
							<button
								type="submit"
								disabled={isSaving || !isAuthenticated} // Disable if saving or not logged in
								className={`flex justify-center items-center px-6 py-3 ${
									isSaving
										? "bg-green-400 cursor-wait"
										: !isAuthenticated
										? "bg-gray-400 cursor-not-allowed"
										: "bg-green-600 hover:bg-green-700"
								} text-white font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors`}
							>
								{isSaving ? (
									<>
										<svg
											className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
										>
											<circle
												className="opacity-25"
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												strokeWidth="4"
											></circle>
											<path
												className="opacity-75"
												fill="currentColor"
												d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
											></path>
										</svg>
										Saving...
									</>
								) : (
									"Save Notification Preferences"
								)}
							</button>
							{saveSuccess && (
								<div className="text-green-600 flex items-center font-medium animate-pulse">
									<CheckIcon className="mr-1" size={20} />
									Preferences saved!
								</div>
							)}
						</div>
					</form>
				</div>
			</main>

			<footer className="mt-16 bg-gray-100 py-8 px-4">
				<div className="container mx-auto text-center text-gray-600">
					<p className="mb-4">
						© {new Date().getFullYear()} Ultron Alert - Environmental Monitoring
					</p>
					<p className="text-sm">Hackathon Project</p>
				</div>
			</footer>
		</div>
	);
};

export default HomePage;
