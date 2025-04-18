
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Mail, Send, Loader2, CheckCircle, ArrowLeft } from "lucide-react";
import { handleForgetPassword, clearError } from "../store/slices/authSlice"; // Adjust path as needed
import toast from "react-hot-toast"; // Optional: if you want toast notifications

function ForgotPassword() {
	const [email, setEmail] = useState("");
	const [isSubmitted, setIsSubmitted] = useState(false); // To show success message

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { loading, error } = useSelector((state) => state.auth);

	// Clear error on component mount and unmount
	useEffect(() => {
		dispatch(clearError());
		return () => {
			dispatch(clearError());
		};
	}, [dispatch]);

	const handleEmailChange = (e) => {
		setEmail(e.target.value);
		// Clear submitted state if user types again
		if (isSubmitted) {
			setIsSubmitted(false);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		dispatch(clearError()); // Clear previous errors
		setIsSubmitted(false); // Reset submitted state

		if (!email) {
			toast.error("Please enter your email address."); // Use toast or rely on Redux error state
			return;
		}

		dispatch(handleForgetPassword(email))
			.unwrap()
			.then((message) => {
				// Success: message comes from handleForgetPassword fulfilled action (if returned)
				setIsSubmitted(true);
				// Optional: show toast notification
				// toast.success(message || "Password reset instructions sent!");
				setEmail(""); // Clear the input field on success
			})
			.catch((err) => {
				// Error is already handled by the slice and stored in error state
				// Optional: show toast notification
				// toast.error(err || "Failed to send reset instructions.");
				setIsSubmitted(false); // Ensure success message isn't shown
			});
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex flex-col justify-center items-center px-4">
			<main className="w-full max-w-md">
				<div className="bg-white rounded-xl shadow-2xl p-8 space-y-6 border border-gray-200">
					<h2 className="text-3xl font-bold mb-2 text-center text-green-800 flex items-center justify-center gap-2">
						<Mail size={28} />
						Forgot Password?
					</h2>
					<p className="text-center text-gray-600 text-sm mb-6">
						Enter your email address below and we'll send you instructions to
						reset your password.
					</p>

					{/* --- Feedback Area --- */}
					{error &&
						!isSubmitted && ( // Show error only if not successfully submitted
							<div
								className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm mb-4"
								role="alert"
							>
								<span className="block sm:inline">{error}</span>
							</div>
						)}
					{isSubmitted &&
						!error && ( // Show success message only if submitted and no new error
							<div
								className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative text-sm mb-4 flex items-center gap-2"
								role="alert"
							>
								<CheckCircle size={18} />
								<span className="block sm:inline">
									If an account exists for {email || "that address"}, password
									reset instructions have been sent. Please check your inbox
									(and spam folder).
								</span>
							</div>
						)}
					{/* --- End Feedback Area --- */}

					<form onSubmit={handleSubmit} className="space-y-5">
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Email Address <span className="text-red-500">*</span>
							</label>
							<div className="relative">
								<Mail
									className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
									size={18}
								/>
								<input
									type="email"
									id="email"
									name="email"
									value={email}
									onChange={handleEmailChange}
									placeholder="you@example.com"
									className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm disabled:bg-gray-100"
									required
									disabled={loading || isSubmitted} // Disable input after successful submission or during loading
								/>
							</div>
						</div>

						{/* Submit Button */}
						<div>
							<button
								type="submit"
								disabled={loading || isSubmitted} // Disable button if loading or already successfully submitted
								className={`w-full flex justify-center items-center px-6 py-3 mt-2 ${
									loading || isSubmitted
										? "bg-green-400 cursor-not-allowed"
										: "bg-green-600 hover:bg-green-700"
								} text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200`}
							>
								{loading ? (
									<Loader2 className="animate-spin mr-2" size={20} />
								) : (
									<Send size={18} className="mr-2" />
								)}
								{loading ? "Sending..." : "Send Reset Instructions"}
							</button>
						</div>
					</form>

					{/* Back to Login Link */}
					<div className="text-center mt-6">
						<Link
							to="/login" // Point this to your login route
							className="text-sm text-green-600 hover:text-green-800 hover:underline inline-flex items-center gap-1"
						>
							<ArrowLeft size={16} />
							Back to Login
						</Link>
					</div>
				</div>
			</main>

			{/* Optional Footer */}
			<footer className="mt-8 text-center text-gray-500 text-sm">
				© {new Date().getFullYear()} Project Ultron. Environmental Monitoring.
			</footer>
		</div>
	);
}

export default ForgotPassword;
