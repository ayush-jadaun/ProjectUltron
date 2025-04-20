import React from "react";
import { motion } from "framer-motion";
import {
	Users,
	Shield,
	Globe,
	Leaf,
	Target,
	Heart,
	Zap,
	Award,
	Clock,
	MapPin,
} from "lucide-react";
import EnvironmentBackgroundLayers from "../assets/EnvironmentBackgroundLayers";

const AboutUs = () => {
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
		hidden: { y: 20, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1,
			transition: {
				duration: 0.5,
			},
		},
	};

	const teamMembers = [
		{
			name: "Ayush Jadaun",
			role: "Full Stack Developer",
			bio: "Passionate about sustainable tech solutions and environmental conservation.",
			image: "/team/ayush-j.jpg", // Replace with actual path
		},
		{
			name: "Ayush Agarwal",
			role: "Full Stack Developer",
			bio: "Specializes in creating intuitive interfaces for environmental monitoring systems.",
			image: "/team/ayush-a.jpg", // Replace with actual path
		},
	];

	const coreValues = [
		{
			name: "Sustainability",
			icon: <Leaf className="text-green-500" />,
			color: "green",
			description:
				"Promoting ecological balance and conservation in all our initiatives.",
		},
		{
			name: "Integrity",
			icon: <Shield className="text-blue-500" />,
			color: "blue",
			description:
				"Maintaining transparency and ethical standards in our data and operations.",
		},
		{
			name: "Innovation",
			icon: <Zap className="text-amber-500" />,
			color: "amber",
			description:
				"Constantly exploring new technological solutions to environmental challenges.",
		},
		{
			name: "Passion",
			icon: <Heart className="text-red-500" />,
			color: "red",
			description:
				"Driven by a genuine love for our planet and its ecosystems.",
		},
	];

	const achievements = [
		{
			number: "1",
			text: "Project",
			icon: <Award />,
		},
		{
			number: "5K+",
			text: "Connections",
			icon: <Globe />,
		},
		{
			number: "2",
			text: "Environmentalists",
			icon: <Clock />,
		},
		{
			number: "8.0",
			text: "Hack36",
			icon: <MapPin />,
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
					{/* Hero Section */}
					<motion.section
						variants={itemVariants}
						className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8 md:p-12 border border-green-100 mb-16 relative overflow-hidden transform transition-all"
					>
						<div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-blue-50/50 opacity-50 z-0"></div>

						<div className="relative z-10">
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 1 }}
								className="w-20 h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full mb-6"
							/>

							<motion.h1
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6 }}
								className="text-4xl md:text-5xl font-bold mb-10 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent"
							>
								About Project Ultron
							</motion.h1>

							<motion.p
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: 0.2 }}
								className="text-lg md:text-xl text-gray-700 mb-10 leading-relaxed max-w-2xl"
							>
								We are a dedicated team of environmental specialists,
								technologists, and conservation advocates united by one mission:
								protecting our planet through cutting-edge technology and
								real-time monitoring solutions. Inspired by Tony Stark's Project
								Ultron, which envisioned a security shield around Earth to
								protect from alien threats, our initiative instead focuses on
								safeguarding our world from human-caused environmental
								damage—creating the protective shield our planet needs not from
								external forces, but from ourselves.
							</motion.p>

							<div className="grid md:grid-cols-2 gap-8 mb-10">
								<div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md border border-green-100/80 transform transition-all hover:shadow-lg">
									<div className="flex items-center mb-4">
										<div className="p-3 bg-green-100 rounded-lg mr-4">
											<Target size={24} className="text-green-600" />
										</div>
										<h2 className="text-xl font-semibold text-green-700">
											Our Mission
										</h2>
									</div>
									<p className="text-gray-600 leading-relaxed">
										To empower individuals and organizations with real-time
										environmental data and early warning systems, enabling
										proactive conservation efforts worldwide.
									</p>
								</div>

								<div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md border border-green-100/80 transform transition-all hover:shadow-lg">
									<div className="flex items-center mb-4">
										<div className="p-3 bg-blue-100 rounded-lg mr-4">
											<Globe size={24} className="text-blue-600" />
										</div>
										<h2 className="text-xl font-semibold text-blue-700">
											Our Vision
										</h2>
									</div>
									<p className="text-gray-600 leading-relaxed">
										A world where environmental monitoring and protection are
										accessible to everyone, creating a global network of
										informed environmental stewards.
									</p>
								</div>
							</div>
						</div>
					</motion.section>

					{/* Stats Section */}
					<motion.section variants={itemVariants} className="mb-16">
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							{achievements.map((item, index) => (
								<motion.div
									key={index}
									whileHover={{ y: -5 }}
									className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md border border-green-100 text-center hover:shadow-lg transition-all duration-300"
								>
									<div className="rounded-full bg-green-100 p-3 w-14 h-14 flex items-center justify-center mx-auto mb-3">
										{React.cloneElement(item.icon, {
											size: 24,
											className: "text-green-600",
										})}
									</div>
									<h3 className="text-2xl font-bold text-green-700 mb-1">
										{item.number}
									</h3>
									<p className="text-gray-600 text-sm">{item.text}</p>
								</motion.div>
							))}
						</div>
					</motion.section>

					{/* Core Values Section */}
					<motion.section variants={itemVariants} className="mb-16">
						<div className="text-center mb-10">
							<motion.h2
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6 }}
								className="text-3xl font-bold text-green-700 mb-3"
							>
								Our Core Values
							</motion.h2>
							<div className="w-16 h-1 bg-green-500 mx-auto mb-6"></div>
							<p className="text-gray-600 max-w-xl mx-auto">
								These principles guide our work and shape our approach to
								environmental monitoring and conservation.
							</p>
						</div>

						<div className="grid md:grid-cols-4 gap-6">
							{coreValues.map((value, index) => (
								<motion.div
									key={index}
									whileHover={{ y: -5 }}
									className={`bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md border border-${value.color}-100 hover:shadow-xl transition-all duration-300`}
								>
									<div
										className={`rounded-full bg-${value.color}-100 p-3 w-14 h-14 flex items-center justify-center mx-auto mb-4`}
									>
										{value.icon}
									</div>
									<h3
										className={`text-xl font-semibold text-${value.color}-600 mb-3 text-center`}
									>
										{value.name}
									</h3>
									<p className="text-gray-600 text-center text-sm">
										{value.description}
									</p>
								</motion.div>
							))}
						</div>
					</motion.section>

					{/* Team Section */}
					<motion.section variants={itemVariants} className="mb-16">
						<div className="text-center mb-10">
							<motion.h2
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6 }}
								className="text-3xl font-bold text-green-700 mb-3"
							>
								Meet Our Team
							</motion.h2>
							<div className="w-16 h-1 bg-green-500 mx-auto mb-6"></div>
							<p className="text-gray-600 max-w-xl mx-auto">
								Passionate experts working together to create innovative
								environmental solutions.
							</p>
						</div>

						<div className="grid md:grid-cols-2 gap-52">
							{teamMembers.map((member, index) => (
								<motion.div
									key={index}
									whileHover={{ y: -5 }}
									className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-green-100 overflow-hidden hover:shadow-xl transition-all duration-300"
								>
									<div className="h-48 bg-gray-200 relative overflow-hidden">
										<div className="absolute inset-0 flex items-center justify-center bg-green-100">
											<Users size={40} className="text-green-300" />
										</div>
										{/* Uncomment if you have actual images */}
										{/* <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover"
                    /> */}
									</div>
									<div className="p-6">
										<h3 className="text-lg font-semibold text-green-700 mb-1">
											{member.name}
										</h3>
										<p className="text-green-500 text-sm font-medium mb-3">
											{member.role}
										</p>
										<p className="text-gray-600 text-sm">{member.bio}</p>
									</div>
								</motion.div>
							))}
						</div>
					</motion.section>

					{/* CTA Section */}
					<motion.section
						variants={itemVariants}
						className="text-center bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl shadow-xl p-10 text-white"
					>
						<motion.h2
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}
							className="text-3xl font-bold mb-4"
						>
							Join Our Mission
						</motion.h2>
						<motion.p
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.2 }}
							className="text-white/90 max-w-xl mx-auto mb-8"
						>
							Ready to make a difference? Connect with us to learn more about
							our environmental monitoring solutions and how you can contribute.
						</motion.p>
						<motion.button
							whileHover={{ scale: 1.05 }}
							onClick={() => {
								window.location.href = "/contact";
							}}
							className="bg-white text-green-600 font-semibold py-3 px-8 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
						>
							Contact Us
						</motion.button>
					</motion.section>
				</main>
			</EnvironmentBackgroundLayers>
		</motion.div>
	);
};

export default AboutUs;
