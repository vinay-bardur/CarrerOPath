import { motion } from 'framer-motion';
import React from 'react';

export default function Dashboard({ user, previousResults, onViewPrevious, onTakeNewQuiz, onSignOut }) {
  const hasPreviousResults = previousResults && Object.keys(previousResults).length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome back, {user?.email?.split('@')[0] || 'User'}! 👋
          </h1>
          <p className="text-xl text-gray-600">
            Ready to continue your career journey?
          </p>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20"
        >
          {hasPreviousResults ? (
            <div className="space-y-8">
              {/* Previous Results Section */}
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Your Career Assessment History
                </h2>
                <p className="text-gray-600 mb-6">
                  You've completed a career assessment before. Would you like to review your previous results or take a new assessment?
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid md:grid-cols-2 gap-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onViewPrevious}
                  className="bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold py-4 px-8 rounded-[60px] shadow-lg hover:shadow-xl transition-all duration-300 text-lg border-2 border-blue-600 hover:border-blue-700"
                >
                  <div className="flex items-center justify-center space-x-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>View Previous Results</span>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onTakeNewQuiz}
                  className="bg-gradient-to-r from-green-600 to-green-800 text-white font-semibold py-4 px-8 rounded-[60px] shadow-lg hover:shadow-xl transition-all duration-300 text-lg border-2 border-green-600 hover:border-green-700"
                >
                  <div className="flex items-center justify-center space-x-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Take New Assessment</span>
                  </div>
                </motion.button>
              </div>

              {/* Previous Results Preview */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Last Assessment Summary
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Completed:</span>
                    <p className="font-medium text-gray-900">
                      {previousResults.completed_at ? 
                        new Date(previousResults.completed_at).toLocaleDateString() : 
                        'Recently'
                      }
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Top Role:</span>
                    <p className="font-medium text-gray-900">
                      {previousResults.recommendations?.recommended_roles?.[0] || 'Software Engineer'}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          ) : (
            <div className="text-center space-y-8">
              {/* New User Section */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Start Your Career Journey
                </h2>
                <p className="text-gray-600 mb-6">
                  Take our comprehensive career assessment to discover your ideal tech career path.
                </p>
              </div>

              {/* Start Assessment Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onTakeNewQuiz}
                className="bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold py-4 px-12 rounded-[60px] shadow-lg hover:shadow-xl transition-all duration-300 text-xl border-2 border-blue-600 hover:border-blue-700"
              >
                <div className="flex items-center justify-center space-x-3">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Start Assessment</span>
                </div>
              </motion.button>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="grid md:grid-cols-3 gap-4 text-sm text-gray-600"
              >
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>15 Questions</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>AI-Powered</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>5 Minutes</span>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>

        {/* Sign Out Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-8"
        >
          <button
            onClick={onSignOut}
            className="text-gray-500 hover:text-gray-700 text-sm underline"
          >
            Sign Out
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}


// Copy paste the cursor report in Claude than also do use the deepseek for longer code than once it is working butter smooth 
// use gpt to push & deploy it in Github than deploy it render start with broken garuda login trace back to the working proeffciency
