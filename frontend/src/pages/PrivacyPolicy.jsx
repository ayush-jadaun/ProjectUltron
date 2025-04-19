import React from "react";
import { motion } from "framer-motion";
import {
	ShieldIcon,
	LockIcon,
	DatabaseIcon,
	UserIcon,
	MailIcon,
} from "lucide-react";
import EnvironmentBackgroundLayers from "../assets/EnvironmentBackgroundLayers";

const PrivacyPolicy = () => {
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
						className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-5 max-w-2xl mx-auto border border-gray-200/50 mb-12 relative overflow-hidden"
					>
						<div className="relative z-10">
							<motion.div
								animate={{ rotate: 360 }}
								transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
								className="mb-6"
							>
								<ShieldIcon size={40} className="text-green-600 mx-auto" />
							</motion.div>
							<motion.h1
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6 }}
								className="text-3xl md:text-4xl font-bold text-green-700 mb-6 text-center bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent"
							>
								Privacy Policy
							</motion.h1>
							<motion.p
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: 0.2 }}
								className="text-xl text-gray-600 mb-6 max-w-xl mx-auto text-center leading-relaxed"
							>
								Your privacy is important to us. This policy outlines how we
								collect, use, and protect your personal information.
							</motion.p>
						</div>
					</motion.section>

					{/* Privacy Sections */}
					<div className="max-w-4xl mx-auto space-y-8">
						<motion.section
							variants={itemVariants}
							className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-gray-200/50"
						>
							<motion.div
								initial={{ opacity: 0, x: -20 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6 }}
								className="flex items-center gap-4 mb-6"
							>
								<LockIcon size={32} className="text-green-600" />
								<h2 className="text-2xl font-semibold text-green-600">
									Information We Collect
								</h2>
							</motion.div>
							<motion.p
								initial={{ opacity: 0, x: -20 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6, delay: 0.2 }}
								className="text-gray-600 leading-relaxed"
							>
								We collect information that you provide directly to us,
								including:
							</motion.p>
							<ul className="list-disc list-inside text-gray-600 space-y-2 mt-4 ml-8">
								<li>Name and contact information</li>
								<li>Location data for environmental monitoring</li>
								<li>Preferences for alert notifications</li>
								<li>Account credentials</li>
							</ul>
						</motion.section>

						<motion.section
							variants={itemVariants}
							className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-gray-200/50"
						>
							<motion.div
								initial={{ opacity: 0, x: -20 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6 }}
								className="flex items-center gap-4 mb-6"
							>
								<DatabaseIcon size={32} className="text-green-600" />
								<h2 className="text-2xl font-semibold text-green-600">
									How We Use Your Information
								</h2>
							</motion.div>
							<motion.p
								initial={{ opacity: 0, x: -20 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6, delay: 0.2 }}
								className="text-gray-600 leading-relaxed"
							>
								We use the collected information to:
							</motion.p>
							<ul className="list-disc list-inside text-gray-600 space-y-2 mt-4 ml-8">
								<li>Provide environmental monitoring services</li>
								<li>Send you relevant alerts and notifications</li>
								<li>Improve our services and user experience</li>
								<li>Communicate with you about updates and changes</li>
							</ul>
						</motion.section>

						<motion.section
							variants={itemVariants}
							className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-gray-200/50"
						>
							<motion.div
								initial={{ opacity: 0, x: -20 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6 }}
								className="flex items-center gap-4 mb-6"
							>
								<ShieldIcon size={32} className="text-green-600" />
								<h2 className="text-2xl font-semibold text-green-600">
									Data Protection
								</h2>
							</motion.div>
							<motion.p
								initial={{ opacity: 0, x: -20 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6, delay: 0.2 }}
								className="text-gray-600 leading-relaxed"
							>
								We implement appropriate security measures to protect your
								information:
							</motion.p>
							<ul className="list-disc list-inside text-gray-600 space-y-2 mt-4 ml-8">
								<li>Encryption of sensitive data</li>
								<li>Regular security audits</li>
								<li>Access controls and authentication</li>
								<li>Secure data storage and transmission</li>
							</ul>
						</motion.section>

						<motion.section
							variants={itemVariants}
							className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-gray-200/50"
						>
							<motion.div
								initial={{ opacity: 0, x: -20 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6 }}
								className="flex items-center gap-4 mb-6"
							>
								<UserIcon size={32} className="text-green-600" />
								<h2 className="text-2xl font-semibold text-green-600">
									Your Rights
								</h2>
							</motion.div>
							<motion.p
								initial={{ opacity: 0, x: -20 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6, delay: 0.2 }}
								className="text-gray-600 leading-relaxed"
							>
								You have the right to:
							</motion.p>
							<ul className="list-disc list-inside text-gray-600 space-y-2 mt-4 ml-8">
								<li>Access your personal information</li>
								<li>Correct inaccurate data</li>
								<li>Request deletion of your data</li>
								<li>Opt-out of communications</li>
							</ul>
						</motion.section>

						<motion.section
							variants={itemVariants}
							className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-gray-200/50"
						>
							<motion.div
								initial={{ opacity: 0, x: -20 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6 }}
								className="flex items-center gap-4 mb-6"
							>
								<MailIcon size={32} className="text-green-600" />
								<h2 className="text-2xl font-semibold text-green-600">
									Contact Us
								</h2>
							</motion.div>
							<motion.p
								initial={{ opacity: 0, x: -20 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6, delay: 0.2 }}
								className="text-gray-600 leading-relaxed"
							>
								If you have any questions about our privacy policy or how we
								handle your data, please contact us at:
							</motion.p>
							<p className="text-green-600 font-medium mt-4">
								privacy@projectultron.com
							</p>
						</motion.section>
					</div>
				</main>
			</EnvironmentBackgroundLayers>
		</motion.div>
	);
};

export default PrivacyPolicy;
