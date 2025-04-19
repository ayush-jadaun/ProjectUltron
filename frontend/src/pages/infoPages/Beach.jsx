import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import coastImage from "../../assets/images/coast.jpg";
import erosionSvg from "../../assets/images/erosion.png";
import solutionSvg from "../../assets/images/eroSol.webp";
import EnvironmentBeachLayers from "../../assets/EnvironmentBeachLayers";
import { ChevronDown, ChevronUp } from "lucide-react";

const Beach = () => {
  const [isCaseStudyOpen, setIsCaseStudyOpen] = useState(false);
  const [isMoreStudiesOpen, setIsMoreStudiesOpen] = useState(false);

  const toggleCaseStudy = () => {
    setIsCaseStudyOpen(!isCaseStudyOpen);
  };

  const toggleMoreStudies = () => {
    setIsMoreStudiesOpen(!isMoreStudiesOpen);
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.8 }
    }
  };

  const slideIn = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const staggerItems = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const expandCollapse = {
    hidden: { 
      height: 0,
      opacity: 0,
      transition: { 
        duration: 0.4,
        ease: "easeInOut"
      }
    },
    visible: { 
      height: "auto",
      opacity: 1,
      transition: { 
        duration: 0.4,
        ease: "easeInOut" 
      }
    }
  };

  return (
    <div className="min-h-screen">
      <EnvironmentBeachLayers>
        <motion.main 
          className="container mx-auto py-12 px-4"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 max-w-4xl mx-auto border border-yellow-300/40 space-y-10"
            variants={slideIn}
          >
            <motion.header 
              className="text-center"
              variants={slideIn}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-yellow-800 mb-4">
                Coastal Erosion
              </h1>
              <motion.p 
                className="text-lg md:text-xl text-gray-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Understanding how our coastlines are changing and what we can do to protect them.
              </motion.p>
            </motion.header>

            <motion.img
              src={coastImage}
              alt="Eroded coastline"
              className="rounded-xl w-full h-64 object-cover shadow-md border border-yellow-200"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            />

            <motion.section 
              className="grid md:grid-cols-2 gap-6 items-center"
              variants={slideIn}
            >
              <div>
                <h2 className="text-2xl font-semibold text-yellow-700 mb-2">
                  What is Coastal Erosion?
                </h2>
                <p className="text-gray-800 text-lg">
                  Coastal erosion is the process by which coastlines are worn away due to natural forces like waves, tides, and currents — often made worse by human activity and climate change.
                </p>
              </div>
              <motion.img
                src={erosionSvg}
                alt="Erosion illustration"
                className="w-full max-h-64 object-contain"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
            </motion.section>

            <motion.section
              variants={slideIn}
            >
              <h2 className="text-2xl font-semibold text-yellow-700 mb-4">
                Causes of Coastal Erosion
              </h2>
              <motion.div 
                className="grid sm:grid-cols-2 gap-4 text-gray-800 text-lg"
                variants={staggerItems}
              >
                <motion.div 
                  className="bg-yellow-100 p-4 rounded-lg shadow-sm"
                  variants={slideIn}
                  whileHover={{ scale: 1.03, backgroundColor: "#FEF3C7" }}
                >
                  🌊 Rising sea levels
                </motion.div>
                <motion.div 
                  className="bg-yellow-100 p-4 rounded-lg shadow-sm"
                  variants={slideIn}
                  whileHover={{ scale: 1.03, backgroundColor: "#FEF3C7" }}
                >
                  💨 Strong winds and storms
                </motion.div>
                <motion.div 
                  className="bg-yellow-100 p-4 rounded-lg shadow-sm"
                  variants={slideIn}
                  whileHover={{ scale: 1.03, backgroundColor: "#FEF3C7" }}
                >
                  🏗️ Coastal development and construction
                </motion.div>
                <motion.div 
                  className="bg-yellow-100 p-4 rounded-lg shadow-sm"
                  variants={slideIn}
                  whileHover={{ scale: 1.03, backgroundColor: "#FEF3C7" }}
                >
                  🚢 Human interference with sediment flow
                </motion.div>
                <motion.div 
                  className="bg-yellow-100 p-4 rounded-lg shadow-sm"
                  variants={slideIn}
                  whileHover={{ scale: 1.03, backgroundColor: "#FEF3C7" }}
                >
                  🌧️ Heavy rainfall and runoff
                </motion.div>
              </motion.div>
            </motion.section>

            <motion.section
              variants={slideIn}
            >
              <h2 className="text-2xl font-semibold text-yellow-700 mb-4">
                Effects of Coastal Erosion
              </h2>
              <motion.ul 
                className="list-disc pl-6 text-gray-800 text-lg space-y-2"
                variants={staggerItems}
              >
                <motion.li variants={slideIn}>Loss of land and property along coastlines</motion.li>
                <motion.li variants={slideIn}>Damage to infrastructure and ecosystems</motion.li>
                <motion.li variants={slideIn}>Saltwater intrusion into freshwater systems</motion.li>
                <motion.li variants={slideIn}>Displacement of coastal communities</motion.li>
                <motion.li variants={slideIn}>Loss of tourism and local economies</motion.li>
              </motion.ul>
            </motion.section>

            <motion.section 
              className="grid md:grid-cols-2 gap-6 items-center"
              variants={slideIn}
            >
              <motion.img
                src={solutionSvg}
                alt="Coastal protection"
                className="w-full max-h-64 object-contain"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
              <div>
                <h2 className="text-2xl font-semibold text-yellow-700 mb-2">
                  Solutions to Coastal Erosion
                </h2>
                <motion.ul 
                  className="list-disc pl-6 text-gray-800 text-lg space-y-2"
                  variants={staggerItems}
                >
                  <motion.li variants={slideIn}>Building sea walls and breakwaters</motion.li>
                  <motion.li variants={slideIn}>Beach nourishment and dune restoration</motion.li>
                  <motion.li variants={slideIn}>Establishing buffer zones and setbacks</motion.li>
                  <motion.li variants={slideIn}>Planting vegetation to stabilize shorelines</motion.li>
                  <motion.li variants={slideIn}>Limiting development in vulnerable areas</motion.li>
                </motion.ul>
              </div>
            </motion.section>

            <motion.section
              variants={slideIn}
            >
              <h2 className="text-2xl font-semibold text-yellow-700 mb-4">
                What You Can Do
              </h2>
              <motion.ul 
                className="list-disc pl-6 text-gray-800 text-lg space-y-2"
                variants={staggerItems}
              >
                <motion.li variants={slideIn}>Support local and global coastal protection initiatives</motion.li>
                <motion.li variants={slideIn}>Reduce your carbon footprint to combat climate change</motion.li>
                <motion.li variants={slideIn}>Volunteer in beach cleanups and conservation efforts</motion.li>
                <motion.li variants={slideIn}>Stay informed and advocate for smart coastal planning</motion.li>
                <motion.li variants={slideIn}>Respect coastal regulations and avoid damaging habitats</motion.li>
              </motion.ul>
            </motion.section>

            {/* Case Study Section */}
            <motion.section 
              className="border border-yellow-200 rounded-xl overflow-hidden bg-gradient-to-br from-yellow-50 to-white"
              variants={slideIn}
            >
              <motion.div
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={toggleCaseStudy}
                whileHover={{ backgroundColor: "#FEFCE8" }}
              >
                <h2 className="text-2xl font-semibold text-yellow-700">
                  Case Study: California's Shrinking Shorelines
                </h2>
                <motion.button
                  className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 p-2 rounded-full transition-all duration-300"
                  aria-label={
                    isCaseStudyOpen ? "Close case study" : "Open case study"
                  }
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isCaseStudyOpen ? (
                    <ChevronUp size={24} />
                  ) : (
                    <ChevronDown size={24} />
                  )}
                </motion.button>
              </motion.div>

              <AnimatePresence>
                {isCaseStudyOpen && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={expandCollapse}
                    className="px-6 py-4"
                  >
                    <motion.div 
                      className="grid md:grid-cols-3 gap-6 mb-6"
                      variants={staggerItems}
                    >
                      <motion.div 
                        className="bg-white rounded-lg p-4 shadow-sm border border-yellow-100"
                        variants={slideIn}
                        whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                      >
                        <h3 className="text-lg font-medium text-yellow-700 mb-2">
                          The Challenge
                        </h3>
                        <p className="text-gray-700">
                          California has lost over 25% of its beaches since 1972, with some coastal communities seeing shorelines retreat by up to 8 feet per year. This trend accelerated with rising sea levels and increased storm intensity.
                        </p>
                      </motion.div>
                      <motion.div 
                        className="bg-white rounded-lg p-4 shadow-sm border border-yellow-100"
                        variants={slideIn}
                        whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                      > 
                        <h3 className="text-lg font-medium text-yellow-700 mb-2">
                          The Response
                        </h3>
                        <p className="text-gray-700">
                          The California Coastal Resilience Initiative launched in 2018 combines strategic retreat with natural solutions. Key projects included dune restoration at 17 beaches and managed retreat of infrastructure at high-risk locations.
                        </p>
                      </motion.div>
                      <motion.div 
                        className="bg-white rounded-lg p-4 shadow-sm border border-yellow-100"
                        variants={slideIn}
                        whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                      >
                        <h3 className="text-lg font-medium text-yellow-700 mb-2">
                          The Results
                        </h3>
                        <p className="text-gray-700">
                          Areas with restored dune systems withstood storm surges 60% better than hardened shorelines. Property damage was reduced by $183 million during the 2022 winter storms in areas with implemented strategies.
                        </p>
                      </motion.div>
                    </motion.div>

                    <motion.div 
                      className="bg-yellow-50 p-6 rounded-lg border border-yellow-200 mb-6"
                      variants={slideIn}
                      whileHover={{ boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                    >
                      <h3 className="text-xl font-medium text-yellow-700 mb-3">
                        Key Success Factors
                      </h3>
                      <motion.ul 
                        className="grid md:grid-cols-2 gap-4"
                        variants={staggerItems}
                      >
                        <motion.li className="flex items-start" variants={slideIn}>
                          <div className="text-yellow-600 font-bold mr-2">1.</div>
                          <p className="text-gray-700">
                            Hybrid approaches combining natural solutions with strategic engineering
                          </p>
                        </motion.li>
                        <motion.li className="flex items-start" variants={slideIn}>
                          <div className="text-yellow-600 font-bold mr-2">2.</div>
                          <p className="text-gray-700">
                            Early community involvement in planning and decision-making processes
                          </p>
                        </motion.li>
                        <motion.li className="flex items-start" variants={slideIn}>
                          <div className="text-yellow-600 font-bold mr-2">3.</div>
                          <p className="text-gray-700">
                            Long-term monitoring programs with adaptive management strategies
                          </p>
                        </motion.li>
                        <motion.li className="flex items-start" variants={slideIn}>
                          <div className="text-yellow-600 font-bold mr-2">4.</div>
                          <p className="text-gray-700">
                            Innovative funding mechanisms combining public and private investments
                          </p>
                        </motion.li>
                      </motion.ul>
                    </motion.div>

                    <motion.div
                      className="cursor-pointer flex items-center justify-between p-4 mt-4 bg-yellow-100 rounded-lg border border-yellow-300"
                      onClick={toggleMoreStudies}
                      whileHover={{ backgroundColor: "#FEF3C7" }}
                      variants={slideIn}
                    >
                      <h3 className="text-lg font-medium text-yellow-700">
                        View More Case Studies
                      </h3>
                      {isMoreStudiesOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </motion.div>

                    <AnimatePresence>
                      {isMoreStudiesOpen && (
                        <motion.div
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          variants={expandCollapse}
                          className="pt-4"
                        >
                          <motion.ul 
                            className="list-disc pl-6 text-gray-700 space-y-3 pt-2"
                            variants={staggerItems}
                          >
                            <motion.li variants={slideIn}>
                              <b>Miami Beach's Living Shorelines:</b> Using mangrove restoration and artificial reefs to protect urban coastlines.
                            </motion.li>
                            <motion.li variants={slideIn}>
                              <b>Netherlands' Sand Motor:</b> An innovative "building with nature" approach using massive sand nourishment.
                            </motion.li>
                            <motion.li variants={slideIn}>
                              <b>Japan's Tetrapod Deployment:</b> Concrete structures to dissipate wave energy along vulnerable coastlines.
                            </motion.li>
                            <motion.li variants={slideIn}>
                              <b>United Kingdom's Managed Retreat:</b> Strategically abandoning certain coastal defenses to create natural buffers.
                            </motion.li>
                          </motion.ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.section>

            <motion.footer 
              className="text-center mt-8"
              variants={slideIn}
            >
              <motion.p 
                className="text-yellow-800 text-lg"
                whileHover={{ scale: 1.05 }}
              >
                🌴 Every effort helps protect our coastlines for future generations.
              </motion.p>
            </motion.footer>
          </motion.div>
        </motion.main>
      </EnvironmentBeachLayers>
    </div>
  );
};

export default Beach;