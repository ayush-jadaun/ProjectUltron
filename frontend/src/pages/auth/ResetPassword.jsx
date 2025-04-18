import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Lock, LockOpen, Loader2, CheckCircle, ArrowLeft } from "lucide-react";
import { handleResetPassword, clearError } from "../slices/authSlice"; // Adjust path as needed
import toast from "react-hot-toast"; // Optional: if you want toast notifications

function ResetPassword() {
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isSubmitted, setIsSubmitted] = useState(false);

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { token } = useParams(); // Get the token from the URL
	const { loading, error } = useSelector((state) => state.auth);

	useEffect(() => {
		dispatch(clearError());
		return () => {
			dispatch(clearError());
		};
	}, [dispatch]);

	const handlePasswordChange = (e) => {
		setPassword(e.target.value);
		if (isSubmitted) {
			setIsSubmitted(false);
		}
	};

	const handleConfirmPasswordChange = (e) => {
		setConfirmPassword(e.target.value);
		if (isSubmitted) {
			setIsSubmitted(false);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		dispatch(clearError());
		setIsSubmitted(false);

		if (!password || !confirmPassword) {
			toast.error("Please enter both password fields.");
			return;
		}

		if (password !== confirmPassword) {
			toast.error("Passwords do not match.");
			return;
		}

		dispatch(handleResetPassword({ token, newPassword: password }))
			.unwrap()
			.then(() => {
				setIsSubmitted(true);
				setPassword("");
				setConfirmPassword("");
				// Optional: toast.success("Password reset successfully!");
			})
			.catch(() => {
				// Error is handled by the slice
				// Optional: toast.error("Failed to reset password.");
				setIsSubmitted(false);
			});
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex flex-col justify-center items-center px-4">
			<main className="w-full max-w-md">
				<div className="bg-white rounded-xl shadow-2xl p-8 space-y-6 border border-gray-200">
					<h2 className="text-3xl font-bold mb-2 text-center text-green-800 flex items-center justify-center gap-2">
						<LockOpen size={28} />
						Reset Password
					</h2>
					<p className="text-center text-gray-600 text-sm mb-6">
						Enter your new password below.
					</p>

					{/* --- Feedback Area --- */}
					{error && !isSubmitted && (
						<div
							className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm mb-4"
							role="alert"
						>
							<span className="block sm:inline">{error}</span>
						</div>
					)}
					{isSubmitted && !error && (
						<div
							className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative text-sm mb-4 flex items-center gap-2"
							role="alert"
						>
							<CheckCircle size={18} />
							<span className="block sm:inline">
								Password reset successfully! You can now{" "}
								<Link to="/login" className="text-green-700 underline">
									login
								</Link>
								.
							</span>
						</div>
					)}
					{/* --- End Feedback Area --- */}

					<form onSubmit={handleSubmit} className="space-y-5">
						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								New Password <span className="text-red-500">*</span>
							</label>
							<div className="relative">
								<Lock
									className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
									size={18}
								/>
								<input
									type="password"
									id="password"
									name="password"
									value={password}
									onChange={handlePasswordChange}
									placeholder="********"
									className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm disabled:bg-gray-100"
									required
									disabled={loading || isSubmitted}
								/>
							</div>
						</div>

						<div>
							<label
								htmlFor="confirmPassword"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Confirm New Password <span className="text-red-500">*</span>
							</label>
							<div className="relative">
								<Lock
									className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
									size={18}
								/>
								<input
									type="password"
									id="confirmPassword"
									name="confirmPassword"
									value={confirmPassword}
									onChange={handleConfirmPasswordChange}
									placeholder="********"
									className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm disabled:bg-gray-100"
									required
									disabled={loading || isSubmitted}
								/>
							</div>
						</div>

						{/* Submit Button */}
						<div>
							<button
								type="submit"
								disabled={loading || isSubmitted}
								className={`w-full flex justify-center items-center px-6 py-3 mt-2 ${
									loading || isSubmitted
										? "bg-green-400 cursor-not-allowed"
										: "bg-green-600 hover:bg-green-700"
								} text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200`}
							>
								{loading ? (
									<Loader2 className="animate-spin mr-2" size={20} />
								) : (
									<LockOpen size={18} className="mr-2" />
								)}
								{loading ? "Resetting..." : "Reset Password"}
							</button>
						</div>
					</form>

					{/* Back to Login Link (Conditionally render based on submission) */}
					{!isSubmitted && (
						<div className="text-center mt-6">
							<Link
								to="/login"
								className="text-sm text-green-600 hover:text-green-800 hover:underline inline-flex items-center gap-1"
							>
								<ArrowLeft size={16} />
								Back to Login
							</Link>
						</div>
					)}
				</div>
			</main>

			{/* Optional Footer */}
			<footer className="mt-8 text-center text-gray-500 text-sm">
				© {new Date().getFullYear()} Project Ultron. Environmental Monitoring.
			</footer>
		</div>
	);
}

export default ResetPassword;
