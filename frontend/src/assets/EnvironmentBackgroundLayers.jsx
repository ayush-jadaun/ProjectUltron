import React from "react";

const EnvironmentBackgroundLayers = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0 z-[-5] bg-gradient-to-b from-blue-400 via-sky-400 to-cyan-300"></div>
      <div className="absolute inset-0 z-[-4] pointer-events-none">
        <div className="absolute top-[10%] left-[15%]">
          <div className="w-20 h-10 sm:w-28 sm:h-14 bg-white rounded-full opacity-90 relative">
            <div className="absolute -top-4 left-4 w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full"></div>
            <div className="absolute -top-2 -right-2 w-10 h-10 sm:w-14 sm:h-14 bg-white rounded-full"></div>
          </div>
        </div>
        <div className="absolute top-[20%] left-[70%] scale-75 sm:scale-90">
          <div className="w-24 h-12 sm:w-32 sm:h-16 bg-white rounded-full opacity-80 relative">
            <div className="absolute -top-5 left-5 w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full"></div>
            <div className="absolute -top-3 right-0 w-14 h-14 sm:w-18 sm:h-18 bg-white rounded-full"></div>
          </div>
        </div>
        <div className="absolute top-[5%] left-[50%] scale-50">
          <div className="w-16 h-8 bg-white rounded-full opacity-85 relative">
            <div className="absolute -top-3 left-3 w-10 h-10 bg-white rounded-full"></div>
          </div>
        </div>
      </div>
      <div
        className="absolute bottom-0 left-0 right-0 h-[60%] z-[-3] bg-gradient-to-t from-lime-400 via-lime-300 to-transparent opacity-80"
        style={{
          clipPath:
            "polygon(0 25%, 15% 15%, 30% 22%, 50% 12%, 70% 20%, 85% 10%, 100% 18%, 100% 100%, 0% 100%)",
        }}
      ></div>
      <div
        className="absolute bottom-0 left-0 right-0 h-2/5 z-[-2] bg-gradient-to-t from-lime-500 to-lime-400"
        style={{
          clipPath:
            "polygon(0 45%, 20% 30%, 45% 40%, 65% 25%, 80% 35%, 100% 30%, 100% 100%, 0% 100%)",
        }}
      ></div>
      <div className="absolute bottom-0 left-0 right-0 h-1/4 z-[-1] bg-green-600"></div>
      <div className="absolute bottom-0 left-0 right-0 h-1/3 z-0 pointer-events-none">
        <div className="absolute bottom-[calc(25%-5px)] left-[15%]">
          <div className="relative flex flex-col items-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-700 rounded-full border-2 border-green-900 shadow-md"></div>
            <div className="w-3 h-10 sm:w-4 sm:h-12 bg-yellow-800 -mt-1 rounded-b-sm"></div>
          </div>
        </div>
        <div className="absolute bottom-[calc(25%-5px)] left-[75%]">
          <div className="relative flex flex-col items-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-800 rounded-full border-2 border-green-900 shadow-md"></div>
            <div className="w-2 h-8 sm:w-3 sm:h-10 bg-yellow-900 -mt-1 rounded-b-sm"></div>
          </div>
        </div>
        <div className="absolute bottom-[calc(40%-20px)] left-[40%] scale-75">
          <div className="relative flex flex-col items-center opacity-90">
            <div className="w-10 h-10 bg-lime-600 rounded-full border-2 border-lime-800"></div>
            <div className="w-2 h-8 bg-yellow-900 -mt-1 rounded-b-sm"></div>
          </div>
        </div>
        <div className="absolute bottom-[calc(25%-5px)] left-[30%]">
          <div className="w-10 h-6 sm:w-14 sm:h-8 bg-green-700 rounded-t-full"></div>
        </div>
        <div className="absolute bottom-[calc(25%-5px)] left-[60%] scale-75">
          <div className="w-10 h-6 sm:w-14 sm:h-8 bg-green-700 rounded-t-full opacity-95"></div>
        </div>
      </div>
      <div className="relative z-10 min-h-screen">{children}</div>
    </div>
  );
};

export default EnvironmentBackgroundLayers;
