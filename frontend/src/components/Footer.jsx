import React from "react";

const Footer = () => {
	return (
		<footer className="bg-green-700 backdrop-blur-sm py-8 px-4">
			{" "}
			<div className="container mx-auto text-center text-white">
				<p className="mb-4">Ultron Alert © {new Date().getFullYear()}</p>
				<p className="text-sm">Hack36 8.0 Project</p>
			</div>
		</footer>
	);
};

export default Footer;
