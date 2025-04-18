import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X, User, Building, Phone, MapPin, Save, Loader2 } from "lucide-react";
import { handleUpdateUser, clearError } from "../../store/slices/authSlice";

const EditProfileModal = ({ currentUser, onClose, onSaveSuccess }) => {
	const dispatch = useDispatch();
	const { loading, error } = useSelector((state) => state.auth);

	const [formData, setFormData] = useState({
		name: "",
		organization_name: "",
		contact_number: "",
		location: "",
	});

	useEffect(() => {
		if (currentUser) {
			setFormData({
				name: currentUser.name || "",
				organization_name: currentUser.organization_name || "",
				contact_number: currentUser.contact_number || "",
				location: currentUser.location || "",
			});
			dispatch(clearError());
		}
	}, [currentUser, dispatch]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		if (error) {
			dispatch(clearError());
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		dispatch(clearError());
		const changedData = {};
		if (formData.name !== currentUser.name) changedData.name = formData.name;
		if (formData.organization_name !== currentUser.organization_name)
			changedData.organization_name = formData.organization_name;
		if (formData.contact_number !== currentUser.contact_number)
			changedData.contact_number = formData.contact_number;
		if (formData.location !== currentUser.location)
			changedData.location = formData.location;

		const dataToSend = {
			name: formData.name,
			organization_name:
				currentUser.user_type === "ngo"
					? formData.organization_name
					: undefined,
			contact_number: formData.contact_number,
			location: formData.location,
		};

		dispatch(handleUpdateUser(dataToSend))
			.unwrap()
			.then(() => {
				onSaveSuccess();
			})
			.catch((err) => {
				console.error("Update failed:", err);
			});
	};

	const handleModalContentClick = (e) => {
		e.stopPropagation();
	};

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4"
			onClick={onClose}
		>
			<div
				className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-200"
				onClick={handleModalContentClick}
			>
				<div className="flex items-center justify-between p-5 border-b border-border-green sticky top-0 bg-white z-10">
					<h3 className="text-xl font-semibold text-dark-green">
						Edit Profile
					</h3>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
						aria-label="Close modal"
					>
						<X size={24} />
					</button>
				</div>

				<form onSubmit={handleSubmit} className="p-6 space-y-5">
					{error && (
						<div
							className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm mb-4"
							role="alert"
						>
							{error}
						</div>
					)}

					<div>
						<label
							htmlFor="edit-name"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Name {currentUser?.user_type !== "ngo" ? "(Optional)" : ""}
						</label>
						<div className="relative">
							<User
								className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
								size={18}
							/>
							<input
								type="text"
								id="edit-name"
								name="name"
								value={formData.name}
								onChange={handleChange}
								placeholder="Your Full Name"
								className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
							/>
						</div>
					</div>

					{currentUser?.user_type === "ngo" && (
						<div>
							<label
								htmlFor="edit-organization_name"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Organization Name <span className="text-red-500">*</span>
							</label>
							<div className="relative">
								<Building
									className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
									size={18}
								/>
								<input
									type="text"
									id="edit-organization_name"
									name="organization_name"
									value={formData.organization_name}
									onChange={handleChange}
									placeholder="Name of your Organization"
									className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
									required
								/>
							</div>
						</div>
					)}

					<div>
						<label
							htmlFor="edit-contact_number"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Contact Number <span className="text-red-500">*</span>
						</label>
						<div className="relative">
							<Phone
								className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
								size={18}
							/>
							<input
								type="tel"
								id="edit-contact_number"
								name="contact_number"
								value={formData.contact_number}
								onChange={handleChange}
								placeholder="+91 12345 67890"
								className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
								required
							/>
						</div>
					</div>

					<div>
						<label
							htmlFor="edit-location"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Location (City/State) <span className="text-red-500">*</span>
						</label>
						<div className="relative">
							<MapPin
								className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
								size={18}
							/>
							<input
								type="text"
								id="edit-location"
								name="location"
								value={formData.location}
								onChange={handleChange}
								placeholder="e.g., Mumbai, Maharashtra"
								className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
								required
							/>
						</div>
					</div>

					<div className="flex items-center justify-end pt-4 border-t border-gray-200 space-x-3">
						<button
							type="button"
							onClick={onClose}
							disabled={loading}
							className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors disabled:opacity-50"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={loading}
							className={`inline-flex items-center gap-2 px-4 py-2 ${
								loading
									? "bg-green-400 cursor-not-allowed"
									: "bg-green-600 hover:bg-green-700"
							} text-white text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50`}
						>
							{loading ? (
								<Loader2 className="animate-spin" size={18} />
							) : (
								<Save size={16} />
							)}
							{loading ? "Saving..." : "Save Changes"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default EditProfileModal;
