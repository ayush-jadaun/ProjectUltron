import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
	User as UserIcon,
	Mail,
	Phone,
	MapPin,
	Building,
	CheckCircle,
	XCircle,
	Edit,
} from "lucide-react"; // Using Lucide icons as in HomePage

// Helper function to format date
const formatDate = (dateString) => {
	if (!dateString) return "N/A";
	try {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	} catch (e) {
		console.error("Error formatting date:", e);
		return "Invalid Date";
	}
};

const UserProfilePage = () => {
	const {
		user,
		isAuthenticated,
		loading: authLoading,
	} = useSelector((state) => state.auth);
	const navigate = useNavigate();

	// Handle navigation to the edit page
	const handleEditProfile = () => {
		navigate("/profile/edit"); // Adjust this route to your actual edit profile route
	};

	// --- Loading State ---
	if (authLoading) {
		return (
			<div className="flex justify-center items-center min-h-screen bg-gray-100">
				<div className="text-center p-10">
					<svg
						className="animate-spin h-8 w-8 text-primary-green mx-auto mb-4"
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
					<p className="text-gray-600">Loading profile...</p>
				</div>
			</div>
		);
	}

	// --- Not Authenticated State ---
	if (!isAuthenticated || !user) {
		return (
			<div className="flex justify-center items-center min-h-screen bg-gray-100">
				<div className="text-center p-10 bg-white shadow-md rounded-lg">
					<h2 className="text-xl font-semibold text-gray-700 mb-4">
						Access Denied
					</h2>
					<p className="text-gray-600 mb-6">
						Please log in to view your profile.
					</p>
					<button
						onClick={() => navigate("/login")} // Navigate to your login page
						className="px-6 py-2 bg-primary-green text-white font-medium rounded-md shadow-sm hover:bg-dark-green focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-green transition ease-in-out duration-150"
					>
						Go to Login
					</button>
				</div>
			</div>
		);
	}

	// --- User Data Available - Display Profile ---

	// Determine the name to display prominently
	const displayName =
		user.user_type === "ngo" && user.organization_name
			? user.organization_name
			: user.name || "Unnamed User";

	// Determine badge style based on user type
	const badgeStyles =
		user.user_type === "ngo"
			? "bg-dark-green text-white"
			: "bg-primary-green text-white";
	const badgeText = user.user_type === "ngo" ? "NGO" : "Normal User";

	// Determine verification status display
	const verificationStatus = user.isVerified ? (
		<>
			<CheckCircle size={16} className="text-verified" />
			<span className="text-verified">Verified</span>
		</>
	) : (
		<>
			<XCircle size={16} className="text-not-verified" />
			<span className="text-not-verified">Not Verified</span>
			{/* Optionally add a button to request verification email again */}
			{/* <button onClick={handleRequestVerification} className="ml-2 text-xs text-blue-600 underline">Resend Email</button> */}
		</>
	);

	return (
		<div className="min-h-screen bg-very-light-green py-12 px-4">
			<div className="container mx-auto max-w-3xl">
				<div className="bg-white rounded-xl shadow-lg overflow-hidden">
					{/* --- Profile Header --- */}
					<header className="bg-light-green p-6 md:p-8 border-b border-border-green flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
						<div className="flex-shrink-0">
							{/* Placeholder Image - Replace with actual dynamic image source if available */}
							<img
								src={
									user.avatarUrl ||
									`https://ui-avatars.com/api/?name=${encodeURIComponent(
										displayName
									)}&background=28a745&color=fff&size=128`
								} // Use ui-avatars as placeholder
								alt="Profile Picture"
								className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-primary-green object-cover bg-gray-300 shadow-md"
							/>
						</div>
						<div className="flex-grow">
							<h1 className="text-2xl md:text-3xl font-bold text-dark-green mb-1">
								{displayName}
							</h1>
							{/* User Type Badge */}
							<span
								className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-2 ${badgeStyles}`}
							>
								{badgeText}
							</span>
							{/* Verification Status */}
							<div className="text-sm font-medium flex items-center justify-center md:justify-start gap-1.5">
								{verificationStatus}
							</div>
						</div>
					</header>

					{/* --- Profile Details --- */}
					<section className="p-6 md:p-8 space-y-5">
						<h2 className="text-xl font-semibold text-dark-green border-b border-border-green pb-2 mb-6 flex items-center gap-2">
							<UserIcon size={20} className="text-primary-green" />
							Account Details
						</h2>

						{/* Display Name (if different from header, e.g., NGO contact person) */}
						{user.user_type === "ngo" &&
							user.name &&
							user.name !== user.organization_name && (
								<div className="detail-item flex flex-col sm:flex-row justify-between sm:items-center py-3 border-b border-gray-100">
									<strong className="text-gray-600 font-medium mb-1 sm:mb-0 flex items-center gap-2">
										<UserIcon
											size={16}
											className="w-5 text-center text-primary-green"
										/>{" "}
										Contact Person:
									</strong>
									<span className="text-gray-800 text-left sm:text-right break-words">
										{user.name}
									</span>
								</div>
							)}

						{/* Organization Name Detail (for NGOs) */}
						{user.user_type === "ngo" && user.organization_name && (
							<div className="detail-item flex flex-col sm:flex-row justify-between sm:items-center py-3 border-b border-gray-100">
								<strong className="text-gray-600 font-medium mb-1 sm:mb-0 flex items-center gap-2">
									<Building
										size={16}
										className="w-5 text-center text-primary-green"
									/>{" "}
									Organization:
								</strong>
								<span className="text-gray-800 text-left sm:text-right break-words">
									{user.organization_name}
								</span>
							</div>
						)}

						{/* Email */}
						<div className="detail-item flex flex-col sm:flex-row justify-between sm:items-center py-3 border-b border-gray-100">
							<strong className="text-gray-600 font-medium mb-1 sm:mb-0 flex items-center gap-2">
								<Mail
									size={16}
									className="w-5 text-center text-primary-green"
								/>{" "}
								Email:
							</strong>
							<span className="text-gray-800 text-left sm:text-right break-words">
								{user.email}
							</span>
						</div>

						{/* Contact Number */}
						<div className="detail-item flex flex-col sm:flex-row justify-between sm:items-center py-3 border-b border-gray-100">
							<strong className="text-gray-600 font-medium mb-1 sm:mb-0 flex items-center gap-2">
								<Phone
									size={16}
									className="w-5 text-center text-primary-green"
								/>{" "}
								Contact Number:
							</strong>
							<span className="text-gray-800 text-left sm:text-right">
								{user.contact_number}
							</span>
						</div>

						{/* Location */}
						<div className="detail-item flex flex-col sm:flex-row justify-between sm:items-center py-3 border-b border-gray-100">
							<strong className="text-gray-600 font-medium mb-1 sm:mb-0 flex items-center gap-2">
								<MapPin
									size={16}
									className="w-5 text-center text-primary-green"
								/>{" "}
								Location:
							</strong>
							<span className="text-gray-800 text-left sm:text-right break-words">
								{user.location}
							</span>
						</div>

						{/* Member Since */}
						<div className="detail-item flex flex-col sm:flex-row justify-between sm:items-center py-3">
							<strong className="text-gray-600 font-medium mb-1 sm:mb-0 flex items-center gap-2">
								{/* Assuming Font Awesome is available for FaClock */}
								<i className="fas fa-clock w-5 text-center text-primary-green"></i>{" "}
								Member Since:
							</strong>
							<span className="text-gray-800 text-left sm:text-right">
								{formatDate(user.createdAt)}
							</span>
						</div>
					</section>

					{/* --- Profile Actions --- */}
					<footer className="bg-gray-50 p-6 md:p-8 border-t border-border-green text-right">
						<button
							onClick={handleEditProfile}
							className="inline-flex items-center gap-2 px-6 py-2 bg-primary-green text-white text-sm font-medium rounded-md shadow-sm hover:bg-dark-green focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-green transition ease-in-out duration-150"
						>
							<Edit size={16} />
							Update Information
						</button>
						{/* You could add other actions here like "Change Password" */}
					</footer>
				</div>
			</div>
		</div>
	);
};

export default UserProfilePage;
