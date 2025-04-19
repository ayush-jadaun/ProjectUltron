// src/pages/HomePage.jsx (Assuming this path)

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
	MapPinIcon,
	BellIcon,
	Mail,
	PhoneIcon,
	CheckIcon,
	LogOut,
	LogIn,
	User, // Added User icon for profile button consistency
} from "lucide-react";
import { handleLogout } from "../store/slices/authSlice";
import { createSubscription } from "../store/slices/subscriptionSlice";
// Corrected import path assumption - place it in components or assets folder
import EnvironmentBackgroundLayers from "../assets/EnvironmentBackgroundLayers";
import EnvironmentBeachLayers from "../assets/EnvironmentBeachLayers";
import EnvironmentFloodingLayers from "../assets/EnvironmentFloodingLayers";
import EnvironmentIcebergLayers from "../assets/EnvironmentIcebergLayers";

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
	const [isSaving, setIsSaving] = useState(false);
	const [saveSuccess, setSaveSuccess] = useState(false);

	// --- Redux State and Hooks ---
	const {
		isAuthenticated,
		user,
		loading: authLoading,
	} = useSelector((state) => state.auth);
	const { creating: subscriptionCreating, error: subscriptionError } =
		useSelector((state) => state.subscription);
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
		if (!isAuthenticated) {
			alert("Please log in to save your preferences.");
			navigate("/login");
			return;
		}

		// Validate required fields
		if (selectedRegions.length === 0) {
			alert("Please select at least one region to monitor.");
			return;
		}

		const selectedTopics = Object.keys(topics).filter((key) => topics[key]);
		if (selectedTopics.length === 0) {
			alert("Please select at least one environmental topic to monitor.");
			return;
		}

		setIsSaving(true);

		// Create GeoJSON for the selected regions
		const regionGeometry =
			selectedRegions.length === 1
				? {
						type: "Point",
						coordinates: [selectedRegions[0].lng, selectedRegions[0].lat],
				  }
				: {
						type: "MultiPoint",
						coordinates: selectedRegions.map((region) => [
							region.lng,
							region.lat,
						]),
				  };

		const subscriptionData = {
			subscription_name: "Environmental Alerts",
			region_geometry: regionGeometry,
			alert_categories: selectedTopics,
			is_active: true,
		};

		// Log the data being sent
		console.log("Sending subscription data:", subscriptionData);

		try {
			const result = await dispatch(
				createSubscription(subscriptionData)
			).unwrap();
			console.log("Subscription created successfully:", result);
			setSaveSuccess(true);
			setTimeout(() => setSaveSuccess(false), 3000);

			// Clear form after successful submission
			setSelectedRegions([]);
			setTopics({
				deforestation: false,
				airPollution: false,
				flooding: false,
				glacierMelting: false,
				urbanExpansion: false,
				coastalErosion: false,
			});
			setNotifyMethod("email");
		} catch (error) {
			console.error("Failed to save preferences:", error);
			alert(error.message || "Failed to save preferences. Please try again.");
		} finally {
			setIsSaving(false);
		}
	};

	const onLoginClick = () => navigate("/login");
	const onProfileClick = () => navigate("/profile"); // Navigate to profile page
	const onLogoutClick = () => {
		dispatch(handleLogout())
			.unwrap()
			.then(() => navigate("/"))
			.catch((err) => console.error("Logout failed:", err));
	};

	useEffect(() => {
		if (isAuthenticated && user) {
			const contact =
				notifyMethod === "email" ? user.email : user.contact_number;
			setContactInfo(contact || "");
		} else {
			setContactInfo("");
		}
	}, [isAuthenticated, user, notifyMethod]);

	return (
		// Remove the overall bg-gray-50 as the Background component will provide the base
		<div className="min-h-screen">
			{/* Header remains outside the background component to stay solid and sticky */}

			{/* Wrap the main content and footer within the background component */}
			<EnvironmentBackgroundLayers>
				{/* Main Content Area */}
				<main className="container mx-auto py-12 px-4">
					{" "}
					{/* Added more top padding */}
					{/* Apply transparency and backdrop blur to the form container */}
					<div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-xl p-6 md:p-8 max-w-4xl mx-auto border border-gray-200/50">
						{" "}
						{/* Made slightly transparent, added blur and subtle border */}
						<h2 className="text-2xl font-bold mb-6 text-green-800 flex items-center">
							Set Up Environmental Alerts
						</h2>
						{!isAuthenticated && (
							<div className="mb-6 p-4 bg-yellow-100/80 border-l-4 border-yellow-500 text-yellow-800 rounded-md backdrop-blur-sm">
								{" "}
								{/* Slight transparency */}
								<p className="font-medium">
									Please{" "}
									<button
										onClick={onLoginClick}
										className="font-bold underline hover:text-yellow-900"
									>
										log in
									</button>{" "}
									or{" "}
									<button
										onClick={onLoginClick}
										className="font-bold underline hover:text-yellow-900"
									>
										sign up
									</button>{" "}
									to save your alert preferences.
								</p>
							</div>
						)}
						{subscriptionError && (
							<div className="mb-6 p-4 bg-red-100/80 border-l-4 border-red-500 text-red-800 rounded-md backdrop-blur-sm">
								<p className="font-medium">{subscriptionError}</p>
							</div>
						)}
						{saveSuccess && (
							<div className="mb-6 p-4 bg-green-100/80 border-l-4 border-green-500 text-green-800 rounded-md backdrop-blur-sm">
								<p className="font-medium">Preferences saved successfully!</p>
							</div>
						)}
						<form onSubmit={handleSubmit} className="space-y-8">
							{/* Region Selection */}
							<section>
								<h3 className="text-lg font-semibold mb-4 flex items-center text-gray-700">
									<MapPinIcon className="mr-2" size={20} />
									Select Regions to Monitor
								</h3>
								{/* Map Placeholder */}
								<div className="mb-6 h-64 border rounded-lg overflow-hidden bg-gray-100/50 backdrop-blur-sm flex items-center justify-center shadow-inner">
									<iframe
										src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15283674.799797209!2d72.09858950579333!3d20.73595779415586!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30635ff06b92b791%3A0xd78c4fa1854213a6!2sIndia!5e0!3m2!1sen!2sin!4v1745021275104!5m2!1sen!2sin"
										width="100%"
										height="100%"
										allowFullScreen=""
										loading="lazy"
										referrerPolicy="no-referrer-when-downgrade"
									></iframe>
								</div>
								{/* Region Buttons */}
								<div className="flex flex-wrap gap-2 mt-4">
									{regions.map((region) => (
										<button
											key={region.id}
											type="button"
											onClick={() => handleRegionToggle(region)}
											className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 ease-in-out shadow-sm ${
												selectedRegions.some((r) => r.id === region.id)
													? "bg-green-600 text-white ring-2 ring-offset-1 ring-green-300 scale-105" // Added scale effect
													: "bg-white/70 text-gray-800 hover:bg-gray-200/80 border border-gray-300" // Changed default look
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
												className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-green-50/50 border border-transparent hover:border-green-200 transition-colors"
											>
												<input
													type="checkbox"
													id={key}
													checked={topics[key]}
													onChange={() => handleTopicToggle(key)}
													className="h-5 w-5 rounded border-gray-300 text-primary-green focus:ring-primary-green focus:ring-offset-1 cursor-pointer shadow-sm"
												/>
												<span className="text-gray-700 select-none font-medium">
													{label}
												</span>
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
									<label className="flex items-center cursor-pointer p-2 rounded hover:bg-gray-50/50">
										<input
											type="radio"
											id="email"
											name="notifyMethod"
											value="email"
											checked={notifyMethod === "email"}
											onChange={() => setNotifyMethod("email")}
											className="h-4 w-4 border-gray-300 text-primary-green focus:ring-primary-green"
										/>
										<span className="ml-2 flex items-center text-gray-700">
											<Mail size={16} className="mr-1" /> Email
										</span>
									</label>
									<label className="flex items-center cursor-pointer p-2 rounded hover:bg-gray-50/50">
										<input
											type="radio"
											id="sms"
											name="notifyMethod"
											value="sms"
											checked={notifyMethod === "sms"}
											onChange={() => setNotifyMethod("sms")}
											className="h-4 w-4 border-gray-300 text-primary-green focus:ring-primary-green"
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
										className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-green focus:border-primary-green sm:text-sm disabled:bg-gray-100/50"
										required
										disabled={!isAuthenticated}
									/>
									{!isAuthenticated && (
										<p className="text-xs text-gray-500 mt-1">
											Log in to enter contact details.
										</p>
									)}
								</div>
							</section>

							{/* Submit Button */}
							{isAuthenticated && (
								<div className="flex justify-end">
									<button
										type="submit"
										disabled={isSaving || subscriptionCreating}
										className={`px-6 py-2 rounded-lg font-medium text-white transition-all duration-150 ease-in-out ${
											isSaving || subscriptionCreating
												? "bg-gray-400 cursor-not-allowed"
												: "bg-green-600 hover:bg-green-700"
										}`}
									>
										{isSaving || subscriptionCreating ? (
											<span className="flex items-center">
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
											</span>
										) : (
											"Save Preferences"
										)}
									</button>
								</div>
							)}
						</form>
					</div>
				</main>
			</EnvironmentBackgroundLayers>
		</div>
	);
};

export default HomePage;
