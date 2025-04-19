import React from "react";
import { motion } from "framer-motion";

const FireEnvironmentBackgroundLayers = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Sky gradient background with animated color shift */}
      <motion.div
        className="absolute inset-0 z-[-5]"
        animate={{
          background: [
            "linear-gradient(to bottom, rgb(253, 230, 138), rgb(251, 191, 36), rgb(248, 113, 113))",
            "linear-gradient(to bottom, rgb(251, 191, 36), rgb(248, 113, 113), rgb(220, 38, 38))",
            "linear-gradient(to bottom, rgb(253, 230, 138), rgb(251, 191, 36), rgb(248, 113, 113))",
          ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      ></motion.div>

      {/* Animated smoke clouds */}
      <div className="absolute inset-0 z-[-4] pointer-events-none">
        <motion.div
          className="absolute top-[8%] left-[12%]"
          animate={{
            x: [0, 10, 0],
            y: [0, -5, 0],
            opacity: [0.9, 0.7, 0.9],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-20 h-10 sm:w-28 sm:h-14 bg-white/90 rounded-full opacity-90 relative shadow-lg">
            <div className="absolute -top-4 left-4 w-12 h-12 sm:w-16 sm:h-16 bg-white/90 rounded-full shadow-md"></div>
            <div className="absolute -top-2 -right-2 w-10 h-10 sm:w-14 sm:h-14 bg-white/90 rounded-full shadow-md"></div>
          </div>
        </motion.div>

        <motion.div
          className="absolute top-[18%] left-[65%] scale-75 sm:scale-90"
          animate={{
            x: [0, -15, 0],
            y: [0, 5, 0],
            opacity: [0.8, 0.6, 0.8],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-24 h-12 sm:w-32 sm:h-16 bg-white/80 rounded-full opacity-80 relative shadow-lg">
            <div className="absolute -top-5 left-5 w-16 h-16 sm:w-20 sm:h-20 bg-white/80 rounded-full shadow-md"></div>
            <div className="absolute -top-3 right-0 w-14 h-14 sm:w-18 sm:h-18 bg-white/80 rounded-full shadow-md"></div>
          </div>
        </motion.div>

        <motion.div
          className="absolute top-[5%] left-[45%] scale-50"
          animate={{
            x: [0, 5, 0],
            y: [0, -3, 0],
            opacity: [0.85, 0.65, 0.85],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-16 h-8 bg-white/85 rounded-full opacity-85 relative shadow-lg">
            <div className="absolute -top-3 left-3 w-10 h-10 bg-white/85 rounded-full shadow-md"></div>
          </div>
        </motion.div>
      </div>

      {/* Animated lava/fire layers */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[60%] z-[-3]"
        animate={{
          background: [
            "linear-gradient(to top, rgba(251, 146, 60, 0.9), rgba(251, 191, 36, 0.3), transparent)",
            "linear-gradient(to top, rgba(248, 113, 113, 0.9), rgba(251, 146, 60, 0.3), transparent)",
            "linear-gradient(to top, rgba(251, 146, 60, 0.9), rgba(251, 191, 36, 0.3), transparent)",
          ],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          clipPath:
            "polygon(0 35%, 15% 25%, 30% 32%, 50% 22%, 70% 30%, 85% 20%, 100% 28%, 100% 100%, 0% 100%)",
        }}
      ></motion.div>

      <motion.div
        className="absolute bottom-0 left-0 right-0 h-2/5 z-[-2]"
        animate={{
          background: [
            "linear-gradient(to top, rgb(248, 113, 113), rgb(251, 146, 60))",
            "linear-gradient(to top, rgb(251, 146, 60), rgb(248, 113, 113))",
            "linear-gradient(to top, rgb(248, 113, 113), rgb(251, 146, 60))",
          ],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          clipPath:
            "polygon(0 45%, 20% 30%, 45% 40%, 65% 25%, 80% 35%, 100% 30%, 100% 100%, 0% 100%)",
        }}
      ></motion.div>

      {/* Base ground layer with subtle animation */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1/4 z-[-1]"
        animate={{
          backgroundColor: [
            "rgb(220, 38, 38)",
            "rgb(185, 28, 28)",
            "rgb(220, 38, 38)",
          ],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      ></motion.div>

      {/* Animated fire elements */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 z-0 pointer-events-none">
        {/* Flame 1 */}
        <motion.div
          className="absolute bottom-[calc(25%-5px)] left-[15%]"
          animate={{
            y: [0, -3, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="relative flex flex-col items-center">
            <div className="w-12 h-16 sm:w-16 sm:h-20 bg-yellow-500 rounded-t-full border-2 border-orange-500 shadow-lg"></div>
            <div className="absolute top-4 left-2 w-8 h-10 sm:w-10 sm:h-12 bg-red-500/70 rounded-t-full"></div>
          </div>
        </motion.div>

        {/* Flame 2 */}
        <motion.div
          className="absolute bottom-[calc(25%-5px)] left-[75%]"
          animate={{
            y: [0, -2, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="relative flex flex-col items-center">
            <div className="w-10 h-14 sm:w-12 sm:h-16 bg-yellow-400 rounded-t-full border-2 border-orange-500 shadow-lg"></div>
            <div className="absolute top-3 left-1 w-6 h-8 sm:w-8 sm:h-10 bg-red-400/70 rounded-t-full"></div>
          </div>
        </motion.div>

        {/* Small flame */}
        <motion.div
          className="absolute bottom-[calc(40%-20px)] left-[40%] scale-75"
          animate={{
            y: [0, -4, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="relative flex flex-col items-center opacity-90">
            <div className="w-10 h-12 bg-yellow-300 rounded-t-full border-2 border-orange-400 shadow-lg"></div>
            <div className="absolute top-2 left-1 w-6 h-7 bg-red-300/70 rounded-t-full"></div>
          </div>
        </motion.div>

        {/* Fire blocks */}
        <motion.div
          className="absolute bottom-[calc(25%-5px)] left-[30%]"
          animate={{
            y: [0, -2, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500 rounded-lg border-t-2 border-l-2  border-r-2 border-b-2 border-orange-700 flex items-center justify-center shadow-lg">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-300 rounded-sm"></div>
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-[calc(25%-5px)] left-[60%] scale-75"
          animate={{
            y: [0, -3, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500 rounded-lg border-t-2 border-l-2 border-r-2 border-b-2 border-orange-700 flex items-center justify-center opacity-95 shadow-lg">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-300 rounded-sm"></div>
          </div>
        </motion.div>

        {/* Small eruption */}
        <motion.div
          className="absolute bottom-[calc(30%)] left-[50%]"
          animate={{
            y: [0, -5, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="relative flex flex-col items-center">
            <div className="w-6 h-12 bg-gradient-to-t from-red-500 to-yellow-300 rounded-full shadow-lg"></div>
            <div className="w-8 h-4 bg-red-600 rounded-t-full -mt-2 shadow-md"></div>
          </div>
        </motion.div>
      </div>

      {/* Content container */}
      <div className="relative z-10 min-h-screen">{children}</div>
    </div>
  );
};

export default FireEnvironmentBackgroundLayers;
