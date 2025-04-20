/*
=============================
        Imports
=============================
*/
import React, { useState } from "react";
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
  Clock,
} from "lucide-react";
import EditProfileModal from "../../components/user/EditProfileModal";
import EnvironmentBackgroundLayers from "../../assets/EnvironmentBackgroundLayers";

/*
=============================
      Date Formatting Helper
=============================
*/
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

/*
=============================
      User Profile Page
=============================
*/
const UserProfilePage = () => {
  // =========================
  //    Redux State & Hooks
  // =========================
  const {
    user,
    isAuthenticated,
    loading: authLoading,
  } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // =========================
  //   Modal State Management
  // =========================
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // =========================
  //     Modal Handlers
  // =========================
  const handleEditProfile = () => setIsEditModalOpen(true);
  const handleCloseModal = () => setIsEditModalOpen(false);
  const handleSaveSuccess = () => setIsEditModalOpen(false);

  /*
	==============================
	      Loading State
	==============================
	*/
  if (authLoading && !user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  /*
	==============================
	  Not Authenticated State
	==============================
	*/
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
            onClick={() => navigate("/login")}
            className="px-6 py-2 bg-green-600 text-white font-medium rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition ease-in-out duration-150"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  /*
	==============================
	      Profile Details
	==============================
	*/
  const displayName =
    user.user_type === "ngo" && user.organization_name
      ? user.organization_name
      : user.name || "Unnamed User";
  const badgeStyles =
    user.user_type === "ngo"
      ? "bg-blue-600 text-white"
      : "bg-green-600 text-white";
  const badgeText =
    user.user_type === "ngo" ? "NGO / Organization" : "Normal User";
  const verificationStatus = user.is_verified ? (
    <>
      <CheckCircle size={16} className="text-green-500" />
      <span className="text-green-600">Verified</span>
    </>
  ) : (
    <>
      <XCircle size={16} className="text-red-500" />
      <span className="text-red-600">Not Verified</span>
    </>
  );

  return (
    <>
      {/* =========================
			     Environment BG Wrapper
		========================= */}
      <div className="min-h-screen">
        <EnvironmentBackgroundLayers>
          <div className="mt-22 container mx-auto max-w-3xl">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* =========================
							      Profile Header
				========================= */}
              <div className="p-6 md:p-8 border-b border-green-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-green-50">
                <div>
                  <h1 className="text-2xl font-bold text-green-800 flex items-center gap-2">
                    <UserIcon size={24} className="text-green-600" />
                    {displayName}
                  </h1>
                  {/* User type badge */}
                  <span
                    className={
                      "inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium " +
                      badgeStyles
                    }
                  >
                    {badgeText}
                  </span>
                </div>
                {/* Verification + Created At */}
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-1">
                    {verificationStatus}
                  </div>
                  {user.created_at && (
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <Clock size={14} />
                      Joined: {formatDate(user.created_at)}
                    </div>
                  )}
                </div>
              </div>

              {/* =========================
					Profile Details
				========================= */}
              <section className="p-6 md:p-8 space-y-5">
                <h2 className="text-xl font-semibold text-green-800 border-b border-green-200 pb-2 mb-6 flex items-center gap-2">
                  <UserIcon size={20} className="text-green-600" />
                  Account Details
                </h2>

                {/* Display Name (for NGOs if different) */}
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
              </section>

              {/* =========================
							      Profile Actions
				========================= */}
              <footer className="bg-gray-50 p-6 md:p-8 border-t border-green-200 text-right">
                <button
                  onClick={handleEditProfile}
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
      {/* =========================
			      Edit Modal
		========================= */}
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

/*
=============================
      Export Component
=============================
*/
export default UserProfilePage;
