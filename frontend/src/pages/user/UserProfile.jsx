import React, { useState } from "react"; // Import useState
import { useSelector, useDispatch } from "react-redux";
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
	Clock, // Added Clock
} from "lucide-react";
import EditProfileModal from "../../components/user/EditProfileModal";
import EnvironmentBackgroundLayers from "../../assets/EnvironmentBackgroundLayers";

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
	const dispatch = useDispatch(); // <-- Add dispatch if needed for actions like resend verification

	// --- State for Modal ---
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);

	// --- Open Modal Handler ---
	const handleEditProfile = () => {
		setIsEditModalOpen(true); // Set state to true to open modal
		// No navigation needed anymore for edit
	};

	// --- Close Modal Handler ---
	const handleCloseModal = () => {
		setIsEditModalOpen(false);
	};

	// --- Handler after successful save ---
	const handleSaveSuccess = () => {
		setIsEditModalOpen(false);
		// Toast notification is handled in the slice/modal, but you could add more here if needed
	};

	// --- Loading State ---
	if (authLoading && !user) {
		// Show loading only if user data isn't available yet
		return (
			<div className="flex justify-center items-center min-h-screen bg-gray-100">
				{/* ... loading spinner ... */}
				<p className="text-gray-600">Loading profile...</p>
			</div>
		);
	}

	// --- Not Authenticated State ---
	if (!isAuthenticated || !user) {
		// ... (keep the existing not authenticated return block) ...
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
						onClick={() => navigate("/login")}
						className="px-6 py-2 bg-green-600 text-white font-medium rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition ease-in-out duration-150"
					>
						Go to Login
					</button>
				</div>
			</div>
		);
	}

	const displayName =
		user.user_type === "ngo" && user.organization_name
			? user.organization_name
			: user.name || "Unnamed User";
	const badgeStyles =
		user.user_type === "ngo"
			? "bg-blue-600 text-white"
			: "bg-green-600 text-white"; // Example: blue for NGO
	const badgeText =
		user.user_type === "ngo" ? "NGO / Organization" : "Normal User";
	const verificationStatus = user.isVerified ? (
		<>
			{" "}
			<CheckCircle size={16} className="text-green-500" />{" "}
			<span className="text-green-600">Verified</span>{" "}
		</>
	) : (
		<>
			{" "}
			<XCircle size={16} className="text-red-500" />{" "}
			<span className="text-red-600">Not Verified</span>{" "}
		</>
	);

	return (
		<>
			{" "}
			{/* Use Fragment shorthand */}
			<div className="min-h-screen">
				<EnvironmentBackgroundLayers>
					<div className="mt-22 container mx-auto max-w-3xl">
						<div className="bg-white rounded-xl shadow-lg overflow-hidden">
							{/* --- Profile Header --- */}

							{/* --- Profile Details --- */}
							<section className="p-6 md:p-8 space-y-5">
								<h2 className="text-xl font-semibold text-green-800 border-b border-green-200 pb-2 mb-6 flex items-center gap-2">
									<UserIcon size={20} className="text-green-600" />
									Account Details
								</h2>

								{/* Display Name (if different) */}
								{user.user_type === "ngo" &&
									user.name &&
									user.name !== user.organization_name && (
										<div className="detail-item flex flex-col sm:flex-row justify-between sm:items-center py-3 border-b border-gray-100">
											<strong className="text-gray-600 font-medium mb-1 sm:mb-0 flex items-center gap-2">
												<UserIcon size={16} className="text-green-600" />{" "}
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
											<Building size={16} className="text-green-600" />{" "}
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
										<Mail size={16} className="text-green-600" /> Email:
									</strong>
									<span className="text-gray-800 text-left sm:text-right break-words">
										{user.email}
									</span>
								</div>
								{/* Contact Number */}
								<div className="detail-item flex flex-col sm:flex-row justify-between sm:items-center py-3 border-b border-gray-100">
									<strong className="text-gray-600 font-medium mb-1 sm:mb-0 flex items-center gap-2">
										<Phone size={16} className="text-green-600" /> Contact
										Number:
									</strong>
									<span className="text-gray-800 text-left sm:text-right">
										{user.contact_number}
									</span>
								</div>
								{/* Location */}
								<div className="detail-item flex flex-col sm:flex-row justify-between sm:items-center py-3 border-b border-gray-100">
									<strong className="text-gray-600 font-medium mb-1 sm:mb-0 flex items-center gap-2">
										<MapPin size={16} className="text-green-600" /> Location:
									</strong>
									<span className="text-gray-800 text-left sm:text-right break-words">
										{user.location}
									</span>
								</div>
								{/* Member Since */}
								<div className="detail-item flex flex-col sm:flex-row justify-between sm:items-center py-3">
									<strong className="text-gray-600 font-medium mb-1 sm:mb-0 flex items-center gap-2">
										<Clock size={16} className="text-green-600" />{" "}
										{/* Replaced Font Awesome */}
										Member Since:
									</strong>
									<span className="text-gray-800 text-left sm:text-right">
										{formatDate(user.createdAt)}
									</span>
								</div>
							</section>

							{/* --- Profile Actions --- */}
							<footer className="bg-gray-50 p-6 md:p-8 border-t border-green-200 text-right">
								<button
									onClick={handleEditProfile} // Calls the function to open the modal
									className="inline-flex items-center gap-2 px-6 py-2 bg-green-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition ease-in-out duration-150"
								>
									<Edit size={16} />
									Update Information
								</button>
							</footer>
						</div>
					</div>
				</EnvironmentBackgroundLayers>
			</div>
			{/* --- Conditionally Render Modal --- */}
			{isEditModalOpen && (
				<EditProfileModal
					currentUser={user}
					onClose={handleCloseModal}
					onSaveSuccess={handleSaveSuccess}
				/>
			)}
		</>
	);
};

export default UserProfilePage;
