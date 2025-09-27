import { motion } from "framer-motion";
import React from "react";

const Home = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-0 overflow-hidden">
      {/* Full-screen background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[10%] right-[10%] w-[40vw] h-[40vw] min-w-[300px] min-h-[300px] bg-blue-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob"></div>
        <div className="absolute bottom-[10%] left-[10%] w-[40vw] h-[40vw] min-w-[300px] min-h-[300px] bg-indigo-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <motion.div
        className="w-full max-w-6xl text-center px-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <motion.h1
          className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-gray-900 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Discover Your Career Superpower
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl lg:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Get matched with a career path based on your unique personality and traits.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <button
            onClick={onGetStarted}
            className="inline-block px-12 py-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white text-xl font-medium rounded-[60px] shadow-xl hover:shadow-2xl transition-all duration-300 group"
          >
            Let's Dig In
            <span className="ml-3 group-hover:translate-x-2 transition-transform duration-300 inline-block">
              →
            </span>
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;