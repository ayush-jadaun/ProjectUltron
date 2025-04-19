import React, { useState, useEffect } from "react";
import { handleLogout } from "../store/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { BellIcon, LogIn, LogOut, User, Menu, X } from "lucide-react";
import { useNavigate, Link, useLocation } from "react-router-dom";

const getPageColors = (pathname) => {
	switch (pathname) {
		case "/green":
			return {
				gradient: "bg-gradient-to-r from-green-700 via-green-600 to-green-500",
				text: "text-white",
				hover: "hover:bg-green-700",
				activeGlow: "shadow-[0_0_15px_rgba(34,197,94,0.5)]",
				button: "bg-green-500 hover:bg-green-600",
				border: "border-green-400",
			};
		case "/flood":
			return {
				gradient: "bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500",
				text: "text-white",
				hover: "hover:bg-blue-700",
				activeGlow: "shadow-[0_0_15px_rgba(59,130,246,0.5)]",
				button: "bg-blue-500 hover:bg-blue-600",
				border: "border-blue-400",
			};
		case "/ice":
			return {
				gradient: "bg-gradient-to-r from-cyan-700 via-cyan-600 to-cyan-500",
				text: "text-white",
				hover: "hover:bg-cyan-700",
				activeGlow: "shadow-[0_0_15px_rgba(6,182,212,0.5)]",
				button: "bg-cyan-500 hover:bg-cyan-600",
				border: "border-cyan-400",
			};
		case "/fire":
			return {
				gradient: "bg-gradient-to-r from-red-700 via-red-600 to-red-500",
				text: "text-white",
				hover: "hover:bg-red-700",
				activeGlow: "shadow-[0_0_15px_rgba(239,68,68,0.5)]",
				button: "bg-red-500 hover:bg-red-600",
				border: "border-red-400",
			};
		case "/coast":
			return {
				gradient: "bg-gradient-to-r from-teal-700 via-teal-600 to-teal-500",
				text: "text-white",
				hover: "hover:bg-teal-700",
				activeGlow: "shadow-[0_0_15px_rgba(20,184,166,0.5)]",
				button: "bg-teal-500 hover:bg-teal-600",
				border: "border-teal-400",
			};
		case "/history":
			return {
				gradient:
					"bg-gradient-to-r from-purple-700 via-purple-600 to-purple-500",
				text: "text-white",
				hover: "hover:bg-purple-700",
				activeGlow: "shadow-[0_0_15px_rgba(147,51,234,0.5)]",
				button: "bg-purple-500 hover:bg-purple-600",
				border: "border-purple-400",
			};
		case "/profile":
		case "/analysis":
			return {
				gradient:
					"bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-500",
				text: "text-white",
				hover: "hover:bg-indigo-700",
				activeGlow: "shadow-[0_0_15px_rgba(99,102,241,0.5)]",
				button: "bg-indigo-500 hover:bg-indigo-600",
				border: "border-indigo-400",
			};
		default:
			return {
				gradient: "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700",
				text: "text-white",
				hover: "hover:bg-gray-700",
				activeGlow: "shadow-[0_0_15px_rgba(75,85,99,0.5)]",
				button: "bg-gray-700 hover:bg-gray-600",
				border: "border-gray-600",
			};
	}
};

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
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	// --- Redux State and Hooks ---
	const {
		isAuthenticated,
		user,
		loading: authLoading,
	} = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	const colors = getPageColors(location.pathname);

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
	const onProfileClick = () => navigate("/profile");
	const onLogoutClick = () => {
		dispatch(handleLogout())
			.unwrap()
			.then(() => navigate("/"))
			.catch((err) => console.error("Logout failed:", err));
	};

	const toggleMobileMenu = () => {
		setMobileMenuOpen(!mobileMenuOpen);
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

	useEffect(() => {
		// Close mobile menu when navigating
		setMobileMenuOpen(false);
	}, [location.pathname]);

	return (
		<nav
			className={`${colors.gradient} ${colors.text} shadow-xl w-full sticky top-0 z-7777 backdrop-blur-sm bg-opacity-95`}
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-20">
					<div className="flex items-center space-x-6">
						<Link
							to="/"
							className="flex-shrink-0 flex items-center space-x-2 transition-transform hover:scale-105"
						>
							<span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 drop-shadow-lg">
								Project Ultron
							</span>
						</Link>
					</div>

					{/* Desktop Menu */}
					<div className="hidden md:flex items-center space-x-1">
						<Link
							to="/"
							className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
								location.pathname === "/"
									? `bg-white/20 ${colors.activeGlow} backdrop-blur-sm`
									: `${colors.hover} opacity-80 hover:opacity-100`
							}`}
						>
							Home
						</Link>
						<Link
							to="/green"
							className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
								location.pathname === "/green"
									? `bg-white/20 ${colors.activeGlow} backdrop-blur-sm`
									: `${colors.hover} opacity-80 hover:opacity-100`
							}`}
						>
							Deforestation
						</Link>
						<Link
							to="/flood"
							className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
								location.pathname === "/flood"
									? `bg-white/20 ${colors.activeGlow} backdrop-blur-sm`
									: `${colors.hover} opacity-80 hover:opacity-100`
							}`}
						>
							Flood
						</Link>
						<Link
							to="/ice"
							className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
								location.pathname === "/ice"
									? `bg-white/20 ${colors.activeGlow} backdrop-blur-sm`
									: `${colors.hover} opacity-80 hover:opacity-100`
							}`}
						>
							Glaciers
						</Link>
						<Link
							to="/fire"
							className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
								location.pathname === "/fire"
									? `bg-white/20 ${colors.activeGlow} backdrop-blur-sm`
									: `${colors.hover} opacity-80 hover:opacity-100`
							}`}
						>
							Fire
						</Link>
						<Link
							to="/coast"
							className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
								location.pathname === "/coast"
									? `bg-white/20 ${colors.activeGlow} backdrop-blur-sm`
									: `${colors.hover} opacity-80 hover:opacity-100`
							}`}
						>
							Coast
						</Link>
						<Link
							to="/history"
							className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
								location.pathname === "/history"
									? `bg-white/20 ${colors.activeGlow} backdrop-blur-sm`
									: `${colors.hover} opacity-80 hover:opacity-100`
							}`}
						>
							History
						</Link>
					</div>

					{/* User Menu */}
					<div className="flex items-center space-x-4">
						{isAuthenticated ? (
							<div className="flex items-center space-x-2">
								<Link
									to="/profile"
									className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
										location.pathname === "/profile"
											? `bg-white/20 ${colors.activeGlow} backdrop-blur-sm`
											: `${colors.hover} opacity-80 hover:opacity-100`
									}`}
								>
									<User size={16} className="inline mr-1" />
									Profile
								</Link>
								<Link
									to="/analysis"
									className={`hidden sm:flex px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
										location.pathname === "/analysis"
											? `bg-white/20 ${colors.activeGlow} backdrop-blur-sm`
											: `${colors.hover} opacity-80 hover:opacity-100`
									}`}
								>
									Analysis
								</Link>
								<button
									onClick={onLogoutClick}
									className={`${colors.button} px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 border ${colors.border} shadow-md`}
								>
									<LogOut size={16} className="inline mr-1" />
									Logout
								</button>
							</div>
						) : (
							<button
								onClick={onLoginClick}
								className={`${colors.button} px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 border ${colors.border} shadow-md`}
							>
								<LogIn size={16} className="inline mr-1" />
								Login/SignUp
							</button>
						)}

						{/* Mobile menu button */}
						<button
							className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
							onClick={toggleMobileMenu}
						>
							{mobileMenuOpen ? (
								<X size={24} className="text-white" />
							) : (
								<Menu size={24} className="text-white" />
							)}
						</button>
					</div>
				</div>
			</div>

			{/* Mobile Menu */}
			<div
				className={`${
					mobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
				} md:hidden overflow-hidden transition-all duration-300 ease-in-out`}
			>
				<div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black/20 backdrop-blur-md">
					<Link
						to="/"
						className={`block px-3 py-2 rounded-md text-base font-medium ${
							location.pathname === "/"
								? `bg-white/20 ${colors.activeGlow}`
								: `${colors.hover} opacity-80 hover:opacity-100`
						}`}
					>
						Home
					</Link>
					<Link
						to="/green"
						className={`block px-3 py-2 rounded-md text-base font-medium ${
							location.pathname === "/green"
								? `bg-white/20 ${colors.activeGlow}`
								: `${colors.hover} opacity-80 hover:opacity-100`
						}`}
					>
						Deforestation
					</Link>
					<Link
						to="/flood"
						className={`block px-3 py-2 rounded-md text-base font-medium ${
							location.pathname === "/flood"
								? `bg-white/20 ${colors.activeGlow}`
								: `${colors.hover} opacity-80 hover:opacity-100`
						}`}
					>
						Flood
					</Link>
					<Link
						to="/ice"
						className={`block px-3 py-2 rounded-md text-base font-medium ${
							location.pathname === "/ice"
								? `bg-white/20 ${colors.activeGlow}`
								: `${colors.hover} opacity-80 hover:opacity-100`
						}`}
					>
						Glaciers
					</Link>
					<Link
						to="/fire"
						className={`block px-3 py-2 rounded-md text-base font-medium ${
							location.pathname === "/fire"
								? `bg-white/20 ${colors.activeGlow}`
								: `${colors.hover} opacity-80 hover:opacity-100`
						}`}
					>
						Fire
					</Link>
					<Link
						to="/coast"
						className={`block px-3 py-2 rounded-md text-base font-medium ${
							location.pathname === "/coast"
								? `bg-white/20 ${colors.activeGlow}`
								: `${colors.hover} opacity-80 hover:opacity-100`
						}`}
					>
						Coast
					</Link>
					<Link
						to="/history"
						className={`block px-3 py-2 rounded-md text-base font-medium ${
							location.pathname === "/history"
								? `bg-white/20 ${colors.activeGlow}`
								: `${colors.hover} opacity-80 hover:opacity-100`
						}`}
					>
						History
					</Link>

					{isAuthenticated && (
						<Link
							to="/analysis"
							className={`block sm:hidden px-3 py-2 rounded-md text-base font-medium ${
								location.pathname === "/analysis"
									? `bg-white/20 ${colors.activeGlow}`
									: `${colors.hover} opacity-80 hover:opacity-100`
							}`}
						>
							Analysis
						</Link>
					)}
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
