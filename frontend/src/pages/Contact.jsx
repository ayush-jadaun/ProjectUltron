import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Clock, ArrowRight } from "lucide-react";
import EnvironmentBackgroundLayers from "../assets/EnvironmentBackgroundLayers";

const Contact = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
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
		// Handle form submission
		console.log("Form submitted:", formData);
		// Add form submission logic here
	};

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.15,
			},
		},
	};

	const itemVariants = {
		hidden: { y: 15, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1,
			transition: {
				duration: 0.4,
			},
		},
	};

	const contactInfo = [
		{
			icon: <Mail size={20} className="text-green-600" />,
			title: "Email",
			details: ["contact@ecoalert.com"],
		},
		{
			icon: <Phone size={20} className="text-green-600" />,
			title: "Phone",
			details: ["+1 (555) 123-4567"],
		},
		{
			icon: <MapPin size={20} className="text-green-600" />,
			title: "Address",
			details: ["123 Green Street", "Eco City, EC 12345"],
		},
		{
			icon: <Clock size={20} className="text-green-600" />,
			title: "Business Hours",
			details: ["Mon-Fri: 9AM - 6PM", "Weekends: Closed"],
		},
	];

	return (
		<motion.div
			initial="hidden"
			animate="visible"
			variants={containerVariants}
			className="min-h-screen"
		>
			<EnvironmentBackgroundLayers>
				<main className="container mx-auto py-16 px-4 max-w-4xl">
					{/* Header */}
					<motion.div variants={itemVariants} className="text-center mb-12">
						<div className="inline-block p-3 bg-green-100 rounded-full mb-4">
							<Mail size={28} className="text-green-600" />
						</div>
						<h1 className="text-3xl md:text-4xl font-bold text-green-700 mb-4">
							Get in Touch
						</h1>
						<p className="text-gray-600 max-w-lg mx-auto">
							Have questions or feedback about our environmental monitoring
							solutions? We're here to help.
						</p>
					</motion.div>

					{/* Main Content */}
					<div className="bg-white/90 backdrop-blur-md rounded-xl shadow-md border border-gray-100 overflow-hidden">
						<div className="grid md:grid-cols-5 gap-0">
							{/* Contact Information */}
							<motion.div
								variants={itemVariants}
								className="md:col-span-2 bg-gradient-to-br from-green-600 to-green-700 text-white p-8"
							>
								<h2 className="text-xl font-semibold mb-6">
									Contact Information
								</h2>

								<div className="space-y-6">
									{contactInfo.map((item, index) => (
										<div key={index} className="flex items-start gap-3">
											<div className="mt-1">{item.icon}</div>
											<div>
												<h3 className="font-medium text-white/90">
													{item.title}
												</h3>
												{item.details.map((detail, i) => (
													<p key={i} className="text-white/80 text-sm">
														{detail}
													</p>
												))}
											</div>
										</div>
									))}
								</div>

								<div className="mt-12">
									<h3 className="font-medium text-white/90 mb-3">Follow Us</h3>
									<div className="flex space-x-3">
										{["Twitter", "LinkedIn", "Facebook"].map((platform, i) => (
											<button
												key={i}
												className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
											>
												<span className="sr-only">{platform}</span>
											</button>
										))}
									</div>
								</div>
							</motion.div>

							{/* Contact Form */}
							<motion.div variants={itemVariants} className="md:col-span-3 p-8">
								<h2 className="text-xl font-semibold text-gray-800 mb-6">
									Send us a Message
								</h2>

								<form onSubmit={handleSubmit} className="space-y-5">
									<div className="grid md:grid-cols-2 gap-5">
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
											rows="5"
											className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
											required
										></textarea>
									</div>

									<div className="flex justify-end">
										<motion.button
											whileHover={{ scale: 1.02 }}
											whileTap={{ scale: 0.98 }}
											type="submit"
											className="bg-green-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
										>
											Send Message
											<ArrowRight size={16} />
										</motion.button>
									</div>
								</form>
							</motion.div>
						</div>
					</div>
				</main>
			</EnvironmentBackgroundLayers>
		</motion.div>
	);
};

export default Contact;
