import { motion } from "framer-motion";
import React, { useState } from "react";

export default function UserDetails({ onContinueToQuiz }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!name.trim() || !age || !gender) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    
    try {
      // Store user details in localStorage for now
      const userDetails = {
        name: name.trim(),
        age: Number(age),
        gender,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem('userDetails', JSON.stringify(userDetails));
      
      // Proceed to quiz
      onContinueToQuiz(userDetails);
      
    } catch (err) {
      alert("Something went wrong: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-center">
            <h2 className="text-2xl font-semibold text-white">Complete Your Profile</h2>
            <p className="text-blue-100 mt-1">Help us personalize your experience</p>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
                maxLength={30}
                pattern="[A-Za-z ]{2,30}"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <p className="text-xs text-gray-500">Max 30 characters, letters only</p>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Enter your age"
                min="15"
                max="90"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <p className="text-xs text-gray-500">Must be between 15-90</p>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
              >
                <option value="" disabled>Select your gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <motion.button
              type="submit"
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className={`w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                "Continue to Quiz"
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}