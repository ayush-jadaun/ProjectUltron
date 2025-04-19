import React, { useState } from "react";
import { motion } from "framer-motion";
import {
	MailIcon,
	PhoneIcon,
	MapPinIcon,
	SendIcon,
	ClockIcon,
} from "lucide-react";
import EnvironmentBackgroundLayers from "../assets/EnvironmentBackgroundLayers";

const Contact = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		subject: "",
		message: "",
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		// Handle form submission here
		console.log("Form submitted:", formData);
	};

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.2,
			},
		},
	};

	const itemVariants = {
		hidden: { y: 20, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1,
			transition: {
				duration: 0.5,
			},
		},
	};

	return (
		<motion.div
			initial="hidden"
			animate="visible"
			variants={containerVariants}
			className="min-h-screen"
		>
			<EnvironmentBackgroundLayers>
				<main className="container mx-auto py-12 px-4">
					{/* Hero Section */}
					<motion.section
						variants={itemVariants}
						className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-8 max-w-4xl mx-auto border border-gray-200/50 mb-12 relative overflow-hidden"
					>
						<div className="relative z-10">
							<motion.div
								animate={{ rotate: 360 }}
								transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
								className="mb-6"
							>
								<MailIcon size={48} className="text-green-600 mx-auto" />
							</motion.div>
							<motion.h1
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6 }}
								className="text-4xl md:text-5xl font-bold text-green-700 mb-6 text-center bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent"
							>
								Contact Us
							</motion.h1>
							<motion.p
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: 0.2 }}
								className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto text-center leading-relaxed"
							>
								Have questions or feedback? We'd love to hear from you. Reach out to us
								through any of the channels below.
							</motion.p>
						</div>
					</motion.section>

					<div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
						{/* Contact Form */}
						<motion.section
							variants={itemVariants}
							className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-gray-200/50"
						>
							<h2 className="text-2xl font-semibold text-green-600 mb-6">
								Send us a Message
							</h2>
							<form onSubmit={handleSubmit} className="space-y-6">
								<div>
									<label
										htmlFor="name"
										className="block text-sm font-medium text-gray-700 mb-1"
									>
										Name
									</label>
									<input
										type="text"
										id="name"
										name="name"
										value={formData.name}
										onChange={handleChange}
										className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
										required
									/>
								</div>
								<div>
									<label
										htmlFor="email"
										className="block text-sm font-medium text-gray-700 mb-1"
									>
										Email
									</label>
									<input
										type="email"
										id="email"
										name="email"
										value={formData.email}
										onChange={handleChange}
										className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
										required
									/>
								</div>
								<div>
									<label
										htmlFor="subject"
										className="block text-sm font-medium text-gray-700 mb-1"
									>
										Subject
									</label>
									<input
										type="text"
										id="subject"
										name="subject"
										value={formData.subject}
										onChange={handleChange}
										className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
										required
									/>
								</div>
								<div>
									<label
										htmlFor="message"
										className="block text-sm font-medium text-gray-700 mb-1"
									>
										Message
									</label>
									<textarea
										id="message"
										name="message"
										value={formData.message}
										onChange={handleChange}
										rows="4"
										className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
										required
									></textarea>
								</div>
								<motion.button
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									type="submit"
									className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
								>
									<SendIcon size={20} />
									Send Message
								</motion.button>
							</form>
						</motion.section>

						{/* Contact Information */}
						<motion.section
							variants={itemVariants}
							className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-gray-200/50"
						>
							<h2 className="text-2xl font-semibold text-green-600 mb-6">
								Contact Information
							</h2>
							<div className="space-y-6">
								<div className="flex items-start gap-4">
									<MailIcon size={24} className="text-green-600 mt-1" />
									<div>
										<h3 className="font-medium text-gray-900">Email</h3>
										<p className="text-gray-600">contact@ecoalert.com</p>
										<p className="text-gray-600">support@ecoalert.com</p>
									</div>
								</div>
								<div className="flex items-start gap-4">
									<PhoneIcon size={24} className="text-green-600 mt-1" />
									<div>
										<h3 className="font-medium text-gray-900">Phone</h3>
										<p className="text-gray-600">+1 (555) 123-4567</p>
										<p className="text-gray-600">+1 (555) 987-6543</p>
									</div>
								</div>
								<div className="flex items-start gap-4">
									<MapPinIcon size={24} className="text-green-600 mt-1" />
									<div>
										<h3 className="font-medium text-gray-900">Address</h3>
										<p className="text-gray-600">
											123 Green Street
											<br />
											Eco City, EC 12345
											<br />
											United States
										</p>
									</div>
								</div>
								<div className="flex items-start gap-4">
									<ClockIcon size={24} className="text-green-600 mt-1" />
									<div>
										<h3 className="font-medium text-gray-900">Business Hours</h3>
										<p className="text-gray-600">
											Monday - Friday: 9:00 AM - 6:00 PM
											<br />
											Saturday: 10:00 AM - 4:00 PM
											<br />
											Sunday: Closed
										</p>
									</div>
								</div>
							</div>
						</motion.section>
					</div>
				</main>
			</EnvironmentBackgroundLayers>
		</motion.div>
	);
};

export default Contact; 