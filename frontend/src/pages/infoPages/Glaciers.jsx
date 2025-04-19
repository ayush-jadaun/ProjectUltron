import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import glacierImage from "../../assets/images/iceberg.jpg";
import meltingSvg from "../../assets/images/glacier-svgrepo-com.svg";
import solutionSvg from "../../assets/images/polar-svgrepo-com.svg";
import EnvironmentIcebergLayers from "../../assets/EnvironmentIcebergLayers";
import { ChevronDown, ChevronUp } from "lucide-react";

const Glaciers = () => {
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
      <EnvironmentIcebergLayers>
        <motion.main 
          className="container mx-auto py-12 px-4"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 max-w-4xl mx-auto border border-blue-200/40 space-y-10"
            variants={slideIn}
          >
            <motion.header 
              className="text-center"
              variants={slideIn}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
                Melting of Glaciers & Icebergs
              </h1>
              <motion.p 
                className="text-lg md:text-xl text-gray-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Exploring the chilling truth behind climate-driven glacial
                retreat and its global effects.
              </motion.p>
            </motion.header>

            <motion.img
              src={glacierImage}
              alt="Melting glacier"
              className="rounded-xl w-full h-64 object-cover shadow-md border border-blue-100"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            />

            <motion.section 
              className="grid md:grid-cols-2 gap-6 items-center"
              variants={slideIn}
            >
              <div>
                <h2 className="text-2xl font-semibold text-blue-800 mb-2">
                  What is Glacial Melting?
                </h2>
                <p className="text-gray-800 text-lg">
                  Glacial melting refers to the shrinking and thinning of ice
                  masses and icebergs, primarily driven by rising global
                  temperatures. These frozen giants are losing mass at alarming
                  rates, contributing significantly to sea level rise.
                </p>
              </div>
              <motion.img
                src={meltingSvg}
                alt="Melting illustration"
                className="w-full max-h-64 object-contain"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
            </motion.section>

            <motion.section
              variants={slideIn}
            >
              <h2 className="text-2xl font-semibold text-blue-800 mb-4">
                Causes of Glacial Melting
              </h2>
              <motion.div 
                className="grid sm:grid-cols-2 gap-4 text-gray-800 text-lg"
                variants={staggerItems}
              >
                <motion.div 
                  className="bg-blue-100 p-4 rounded-lg shadow-sm"
                  variants={slideIn}
                  whileHover={{ scale: 1.03, backgroundColor: "#EFF6FF" }}
                >
                  🔥 Global warming
                </motion.div>
                <motion.div 
                  className="bg-blue-100 p-4 rounded-lg shadow-sm"
                  variants={slideIn}
                  whileHover={{ scale: 1.03, backgroundColor: "#EFF6FF" }}
                >
                  🌫️ Atmospheric pollution
                </motion.div>
                <motion.div 
                  className="bg-blue-100 p-4 rounded-lg shadow-sm"
                  variants={slideIn}
                  whileHover={{ scale: 1.03, backgroundColor: "#EFF6FF" }}
                >
                  🚗 Greenhouse gas emissions
                </motion.div>
                <motion.div 
                  className="bg-blue-100 p-4 rounded-lg shadow-sm"
                  variants={slideIn}
                  whileHover={{ scale: 1.03, backgroundColor: "#EFF6FF" }}
                >
                  🌪️ Changing ocean currents
                </motion.div>
                <motion.div 
                  className="bg-blue-100 p-4 rounded-lg shadow-sm"
                  variants={slideIn}
                  whileHover={{ scale: 1.03, backgroundColor: "#EFF6FF" }}
                >
                  🏭 Industrial development near polar zones
                </motion.div>
              </motion.div>
            </motion.section>

            <motion.section
              variants={slideIn}
            >
              <h2 className="text-2xl font-semibold text-blue-800 mb-4">
                Effects of Melting Glaciers
              </h2>
              <motion.ul 
                className="list-disc pl-6 text-gray-800 text-lg space-y-2"
                variants={staggerItems}
              >
                <motion.li variants={slideIn}>Rising global sea levels, threatening coastal cities</motion.li>
                <motion.li variants={slideIn}>Loss of habitats for polar and alpine species</motion.li>
                <motion.li variants={slideIn}>Disruption of freshwater sources for millions</motion.li>
                <motion.li variants={slideIn}>Changes in ocean salinity and currents</motion.li>
                <motion.li variants={slideIn}>Increased frequency of natural disasters like floods</motion.li>
              </motion.ul>
            </motion.section>

            <motion.section 
              className="grid md:grid-cols-2 gap-6 items-center"
              variants={slideIn}
            >
              <motion.img
                src={solutionSvg}
                alt="Solutions to glacier melting"
                className="w-full max-h-64 object-contain"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
              <div>
                <h2 className="text-2xl font-semibold text-blue-800 mb-2">
                  Solutions and Actions
                </h2>
                <motion.ul 
                  className="list-disc pl-6 text-gray-800 text-lg space-y-2"
                  variants={staggerItems}
                >
                  <motion.li variants={slideIn}>Switching to renewable energy sources</motion.li>
                  <motion.li variants={slideIn}>Reducing greenhouse gas emissions globally</motion.li>
                  <motion.li variants={slideIn}>Reforestation and afforestation programs</motion.li>
                  <motion.li variants={slideIn}>Support for climate agreements and regulations</motion.li>
                  <motion.li variants={slideIn}>Research and monitoring of polar regions</motion.li>
                </motion.ul>
              </div>
            </motion.section>

            <motion.section
              variants={slideIn}
            >
              <h2 className="text-2xl font-semibold text-blue-800 mb-4">
                What Can You Do?
              </h2>
              <motion.ul 
                className="list-disc pl-6 text-gray-800 text-lg space-y-2"
                variants={staggerItems}
              >
                <motion.li variants={slideIn}>
                  Reduce your carbon footprint through conscious travel and
                  consumption
                </motion.li>
                <motion.li variants={slideIn}>
                  Use energy-efficient appliances and support clean energy
                </motion.li>
                <motion.li variants={slideIn}>Educate others about climate change and its impacts</motion.li>
                <motion.li variants={slideIn}>Support conservation organizations and clean policies</motion.li>
                <motion.li variants={slideIn}>Stay informed and vote for climate-positive leadership</motion.li>
              </motion.ul>
            </motion.section>

            <motion.section 
              className="border border-blue-200 rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 to-white"
              variants={slideIn}
            >
              <motion.div
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={toggleCaseStudy}
              >
                <h2 className="text-2xl font-semibold text-blue-800">
                  Case Study: Greenland Ice Sheet Loss
                </h2>
                <button
                  className="bg-blue-100 hover:bg-blue-200 text-blue-800 p-2 rounded-full transition-all duration-300"
                  aria-label={
                    isCaseStudyOpen ? "Close case study" : "Open case study"
                  }
                >
                  {isCaseStudyOpen ? (
                    <ChevronUp size={24} />
                  ) : (
                    <ChevronDown size={24} />
                  )}
                </button>
              </motion.div>

              <AnimatePresence>
                {isCaseStudyOpen && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={expandCollapse}
                    className="overflow-hidden"
                  >
                    <div className="grid md:grid-cols-3 gap-6 mb-6">
                      <motion.div 
                        className="bg-white rounded-lg p-4 shadow-sm border border-blue-100"
                        variants={slideIn}
                      >
                        <h3 className="text-lg font-medium text-blue-800 mb-2">
                          The Phenomenon
                        </h3>
                        <p className="text-gray-700">
                          The Greenland Ice Sheet has lost over 4,700 billion tons
                          of ice since 1980, with the rate accelerating to 260
                          billion tons annually between 2010-2020 - six times faster
                          than in the 1990s.
                        </p>
                      </motion.div>
                      <motion.div 
                        className="bg-white rounded-lg p-4 shadow-sm border border-blue-100"
                        variants={slideIn}
                      >
                        <h3 className="text-lg font-medium text-blue-800 mb-2">
                          The Impacts
                        </h3>
                        <p className="text-gray-700">
                          This melt has already contributed more than 1.3 cm to
                          global sea level rise. If the entire Greenland Ice Sheet
                          melted, global sea levels would rise by approximately 7
                          meters (23 feet).
                        </p>
                      </motion.div>
                      <motion.div 
                        className="bg-white rounded-lg p-4 shadow-sm border border-blue-100"
                        variants={slideIn}
                      >
                        <h3 className="text-lg font-medium text-blue-800 mb-2">
                          The Research
                        </h3>
                        <p className="text-gray-700">
                          Over 40 research stations monitor the ice sheet with
                          satellites, aerial surveys, and ground measurements. Data
                          shows darker ice surfaces absorbing more sunlight,
                          creating a feedback loop accelerating melting.
                        </p>
                      </motion.div>
                    </div>

                    <motion.div 
                      className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-6"
                      variants={slideIn}
                    >
                      <h3 className="text-xl font-medium text-blue-800 mb-3">
                        Key Findings
                      </h3>
                      <motion.ul 
                        className="grid md:grid-cols-2 gap-4"
                        variants={staggerItems}
                      >
                        <motion.li 
                          className="flex items-start"
                          variants={slideIn}
                        >
                          <div className="text-blue-500 font-bold mr-2">1.</div>
                          <p className="text-gray-700">
                            Summer melt season has extended by 4-5 weeks since the
                            1970s
                          </p>
                        </motion.li>
                        <motion.li 
                          className="flex items-start"
                          variants={slideIn}
                        >
                          <div className="text-blue-500 font-bold mr-2">2.</div>
                          <p className="text-gray-700">
                            Glacial retreat has uncovered land that had been
                            ice-covered for over 45,000 years
                          </p>
                        </motion.li>
                        <motion.li 
                          className="flex items-start"
                          variants={slideIn}
                        >
                          <div className="text-blue-500 font-bold mr-2">3.</div>
                          <p className="text-gray-700">
                            Meltwater is creating massive subsurface lakes and
                            rivers within the ice sheet
                          </p>
                        </motion.li>
                        <motion.li 
                          className="flex items-start"
                          variants={slideIn}
                        >
                          <div className="text-blue-500 font-bold mr-2">4.</div>
                          <p className="text-gray-700">
                            The Atlantic Meridional Overturning Circulation is
                            showing signs of slowing due to freshwater influx
                          </p>
                        </motion.li>
                      </motion.ul>
                    </motion.div>

                    <motion.div
                      className="cursor-pointer flex items-center justify-between p-4 mt-4 bg-blue-100 rounded-lg border border-blue-300"
                      onClick={toggleMoreStudies}
                      variants={slideIn}
                    >
                      <h3 className="text-lg font-medium text-blue-800">
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
                          className="overflow-hidden"
                        >
                          <motion.ul 
                            className="list-disc pl-6 text-gray-700 space-y-3 pt-2"
                            variants={staggerItems}
                          >
                            <motion.li variants={slideIn}>
                              <b>Antarctic Peninsula:</b> Rapid warming and ice shelf collapse
                              leading to accelerated glacier flow into the ocean.
                            </motion.li>
                            <motion.li variants={slideIn}>
                              <b>Himalayan Glaciers:</b> Retreat affecting water supplies for
                              over 1 billion people in Asia.
                            </motion.li>
                            <motion.li variants={slideIn}>
                              <b>Alaskan Glaciers:</b> Dramatic retreat and contribution to
                              sea level rise in the Pacific region.
                            </motion.li>
                          </motion.ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.section>
          </motion.div>
        </motion.main>
      </EnvironmentIcebergLayers>
    </div>
  );
};

export default Glaciers;