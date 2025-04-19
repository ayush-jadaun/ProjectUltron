import React, { useState } from "react";
import glacierImage from "../../assets/images/iceberg.jpg";
import meltingSvg from "../../assets/images/glacier-svgrepo-com.svg";
import solutionSvg from "../../assets/images/polar-svgrepo-com.svg";
import EnvironmentIcebergLayers from "../../assets/EnvironmentIcebergLayers";
import { ChevronDown, ChevronUp } from "lucide-react";

const Glaciers = () => {
  const [isCaseStudyOpen, setIsCaseStudyOpen] = useState(false);

  const toggleCaseStudy = () => {
    setIsCaseStudyOpen(!isCaseStudyOpen);
  };

  return (
    <div className="min-h-screen">
      <EnvironmentIcebergLayers>
        <main className="container mx-auto py-12 px-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 max-w-4xl mx-auto border border-blue-200/40 space-y-10">
            <header className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
                Melting of Glaciers & Icebergs
              </h1>
              <p className="text-lg md:text-xl text-gray-700">
                Exploring the chilling truth behind climate-driven glacial
                retreat and its global effects.
              </p>
            </header>

            <img
              src={glacierImage}
              alt="Melting glacier"
              className="rounded-xl w-full h-64 object-cover shadow-md border border-blue-100"
            />

            <section className="grid md:grid-cols-2 gap-6 items-center">
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
              <img
                src={meltingSvg}
                alt="Melting illustration"
                className="w-full max-h-64 object-contain"
              />
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-800 mb-4">
                Causes of Glacial Melting
              </h2>
              <div className="grid sm:grid-cols-2 gap-4 text-gray-800 text-lg">
                <div className="bg-blue-100 p-4 rounded-lg shadow-sm">
                  🔥 Global warming
                </div>
                <div className="bg-blue-100 p-4 rounded-lg shadow-sm">
                  🌫️ Atmospheric pollution
                </div>
                <div className="bg-blue-100 p-4 rounded-lg shadow-sm">
                  🚗 Greenhouse gas emissions
                </div>
                <div className="bg-blue-100 p-4 rounded-lg shadow-sm">
                  🌪️ Changing ocean currents
                </div>
                <div className="bg-blue-100 p-4 rounded-lg shadow-sm">
                  🏭 Industrial development near polar zones
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-800 mb-4">
                Effects of Melting Glaciers
              </h2>
              <ul className="list-disc pl-6 text-gray-800 text-lg space-y-2">
                <li>Rising global sea levels, threatening coastal cities</li>
                <li>Loss of habitats for polar and alpine species</li>
                <li>Disruption of freshwater sources for millions</li>
                <li>Changes in ocean salinity and currents</li>
                <li>Increased frequency of natural disasters like floods</li>
              </ul>
            </section>

            <section className="grid md:grid-cols-2 gap-6 items-center">
              <img
                src={solutionSvg}
                alt="Solutions to glacier melting"
                className="w-full max-h-64 object-contain"
              />
              <div>
                <h2 className="text-2xl font-semibold text-blue-800 mb-2">
                  Solutions and Actions
                </h2>
                <ul className="list-disc pl-6 text-gray-800 text-lg space-y-2">
                  <li>Switching to renewable energy sources</li>
                  <li>Reducing greenhouse gas emissions globally</li>
                  <li>Reforestation and afforestation programs</li>
                  <li>Support for climate agreements and regulations</li>
                  <li>Research and monitoring of polar regions</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-800 mb-4">
                What Can You Do?
              </h2>
              <ul className="list-disc pl-6 text-gray-800 text-lg space-y-2">
                <li>
                  Reduce your carbon footprint through conscious travel and
                  consumption
                </li>
                <li>
                  Use energy-efficient appliances and support clean energy
                </li>
                <li>Educate others about climate change and its impacts</li>
                <li>Support conservation organizations and clean policies</li>
                <li>Stay informed and vote for climate-positive leadership</li>
              </ul>
            </section>

            {/* Case Study Section */}
            <section className="border border-blue-200 rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 to-white">
              <div
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
              </div>

              <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${
                  isCaseStudyOpen
                    ? "max-h-screen opacity-100 py-4 px-6"
                    : "max-h-0 opacity-0 p-0"
                }`}
              >
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-100">
                    <h3 className="text-lg font-medium text-blue-800 mb-2">
                      The Phenomenon
                    </h3>
                    <p className="text-gray-700">
                      The Greenland Ice Sheet has lost over 4,700 billion tons
                      of ice since 1980, with the rate accelerating to 260
                      billion tons annually between 2010-2020 - six times faster
                      than in the 1990s.
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-100">
                    <h3 className="text-lg font-medium text-blue-800 mb-2">
                      The Impacts
                    </h3>
                    <p className="text-gray-700">
                      This melt has already contributed more than 1.3 cm to
                      global sea level rise. If the entire Greenland Ice Sheet
                      melted, global sea levels would rise by approximately 7
                      meters (23 feet).
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-100">
                    <h3 className="text-lg font-medium text-blue-800 mb-2">
                      The Research
                    </h3>
                    <p className="text-gray-700">
                      Over 40 research stations monitor the ice sheet with
                      satellites, aerial surveys, and ground measurements. Data
                      shows darker ice surfaces absorbing more sunlight,
                      creating a feedback loop accelerating melting.
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-6">
                  <h3 className="text-xl font-medium text-blue-800 mb-3">
                    Key Findings
                  </h3>
                  <ul className="grid md:grid-cols-2 gap-4">
                    <li className="flex items-start">
                      <div className="text-blue-500 font-bold mr-2">1.</div>
                      <p className="text-gray-700">
                        Summer melt season has extended by 4-5 weeks since the
                        1970s
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="text-blue-500 font-bold mr-2">2.</div>
                      <p className="text-gray-700">
                        Glacial retreat has uncovered land that had been
                        ice-covered for over 45,000 years
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="text-blue-500 font-bold mr-2">3.</div>
                      <p className="text-gray-700">
                        Meltwater is creating massive subsurface lakes and
                        rivers within the ice sheet
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="text-blue-500 font-bold mr-2">4.</div>
                      <p className="text-gray-700">
                        The Atlantic Meridional Overturning Circulation is
                        showing signs of slowing due to freshwater influx
                      </p>
                    </li>
                  </ul>
                </div>

                <div className="flex justify-between items-center border-t border-blue-200 pt-4">
                  <blockquote className="italic text-gray-700 pl-4 border-l-4 border-blue-300">
                    "What happens in the Arctic doesn't stay in the Arctic. The
                    loss of Greenland's ice affects weather patterns and sea
                    levels worldwide."
                    <footer className="text-sm font-medium text-blue-800 mt-1">
                      — Dr. Jason Box, Glaciologist, Geological Survey of
                      Denmark and Greenland
                    </footer>
                  </blockquote>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition">
                    Full Study
                  </button>
                </div>
              </div>
            </section>

            <footer className="text-center mt-8">
              <p className="text-blue-800 text-lg mb-4">
                ❄️ Together, we can slow the melt and preserve Earth's frozen
                wonders.
              </p>
              <button className="bg-blue-700 hover:bg-blue-800 text-white py-2 px-6 rounded-xl shadow-md transition">
                Explore More
              </button>
            </footer>
          </div>
        </main>
      </EnvironmentIcebergLayers>
    </div>
  );
};

export default Glaciers;
