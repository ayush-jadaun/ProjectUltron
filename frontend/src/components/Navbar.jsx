import React, { useState, useEffect } from "react";
import { handleLogout } from "../store/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { BellIcon, LogIn, LogOut, User } from "lucide-react";
import { useAsyncError, useNavigate } from "react-router-dom";
const Navbar = () => {
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
		setIsSaving(true);
		const preferenceData = {
			regions: selectedRegions.map((r) => r.name),
			topics: Object.keys(topics).filter((key) => topics[key]),
			notifyMethod: notifyMethod,
			contactInfo: contactInfo,
			userId: user?.id,
		};
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
		<header className="bg-green-700 text-white p-4 shadow-md sticky top-0 z-20">
			{" "}
			{/* Increased z-index */}
			<div className="container mx-auto flex items-center justify-between">
				<div className="flex items-center">
					<BellIcon className="mr-2 hidden sm:block" size={24} />
					<h1 className="text-xl font-bold">Ultron Alert</h1>
				</div>
				<div>
					{isAuthenticated ? (
						<div className="flex items-center space-x-3 sm:space-x-4">
							<button
								className="flex items-center px-3 py-1.5 sm:px-4 bg-green-900 text-white font-medium text-xs sm:text-sm rounded-lg shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
								onClick={onProfileClick}
								title="View Profile" // Added title for clarity
							>
								<User size={16} className="mr-1.5" /> {/* Added User icon */}
								<span className="hidden md:inline">
									{/* Show name only on medium screens and up */}
									{user?.name?.split(" ")[0] || user?.email}{" "}
									{/* Show first name or email */}
								</span>
							</button>
							<button
								onClick={onLogoutClick}
								disabled={authLoading}
								className={`flex items-center px-3 py-1.5 sm:px-4 ${
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
	);
};

export default Navbar;
