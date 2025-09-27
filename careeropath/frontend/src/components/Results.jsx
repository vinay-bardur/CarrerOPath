import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Results({ userDetails, onStartNewAssessment }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get results from localStorage
    const savedResults = localStorage.getItem('careerRecommendations');
    if (savedResults) {
      try {
        const parsedResults = JSON.parse(savedResults);
        console.log('Loaded results:', parsedResults); // Debug log
        setResult(parsedResults);
      } catch (error) {
        console.error('Error parsing results:', error);
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mb-6 mx-auto"></div>
          <p className="text-gray-600 text-lg">Preparing your results...</p>
        </motion.div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <motion.div 
          className="max-w-md mx-auto bg-white rounded-3xl shadow-xl p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">No Results Found</h2>
          <p className="text-gray-600 mb-6">Please take the quiz first to see your career recommendations.</p>
          <button
            onClick={onStartNewAssessment}
            className="py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl hover:shadow-lg transition-all"
          >
            Start Assessment
          </button>
        </motion.div>
      </div>
    );
  }

  // Extract data with correct property names from your backend
  const roles = result.roles || result.recommended_roles || [];
  const companies = result.companies || result.target_companies || [];
  const salaryRange = result.salary_range || result.expectedSalary || "₹6-10 LPA for freshers";
  const skills = result.skills || result.essential_skills || [];
  const rationale = result.rationale || "";
  const userName = userDetails?.name || "";

  // Roadmap URL mapping
  const roadmapMap = {
    "UX/UI Developer": "https://roadmap.sh/ux-design",
    "UI/UX Designer": "https://roadmap.sh/ux-design",
    "Frontend Developer": "https://roadmap.sh/frontend", 
    "Backend Developer": "https://roadmap.sh/backend",
    "Full Stack Developer": "https://roadmap.sh/full-stack",
    "Data Analyst": "https://roadmap.sh/data-analyst",
    "Data Scientist": "https://roadmap.sh/data-science",
    "Business Analyst": "https://roadmap.sh/business-intelligence-analyst",
    "Product Manager": "https://roadmap.sh/product-manager",
    "Software Engineer": "https://roadmap.sh/software-engineer",
    "DevOps Engineer": "https://roadmap.sh/devops",
    "Security Analyst": "https://roadmap.sh/cyber-security",
    "Cybersecurity": "https://roadmap.sh/cyber-security"
  };

  const getRoadmapUrl = (role) => {
    return roadmapMap[role] || "https://roadmap.sh";
  };

  // Create action plan
  const actionPlan = [
    `Focus on developing: ${skills.slice(0, 3).join(', ') || 'core technical skills'}`,
    `Explore opportunities at: ${companies.slice(0, 3).join(', ') || 'leading tech companies'}`,
    `Research roles in: ${roles.slice(0, 2).join(' and ') || 'your recommended fields'}`,
    "Build portfolio projects to showcase your skills",
    "Network with professionals in your target industry"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4">
      <motion.div 
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
            Your Career Blueprint{userName ? `, ${userName}` : ''}
          </h1>
          <p className="text-xl text-gray-600">Personalized recommendations based on your strengths</p>
        </motion.div>

        {/* Rationale */}
        {rationale && (
          <motion.div 
            className="bg-white rounded-3xl p-8 shadow-xl mb-10 border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Career Path Snapshot</h2>
            <p className="text-gray-700 text-lg leading-relaxed">{rationale}</p>
          </motion.div>
        )}

        {/* Three Column Layout */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Recommended Roles */}
          <motion.div 
            className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4">
                <span className="text-white font-bold text-lg">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Recommended Roles</h3>
            </div>
            <div className="space-y-4">
              {roles.slice(0, 3).map((role, index) => (
                <motion.a
                  key={index}
                  href={getRoadmapUrl(role)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 border border-gray-200 rounded-2xl hover:border-blue-300 hover:bg-blue-50 transition-all group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {role}
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">View learning path →</p>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Expected Salary */}
          <motion.div 
            className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mr-4">
                <span className="text-white font-bold text-lg">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Expected Salary</h3>
            </div>
            <div className="space-y-4">
              {roles.slice(0, 3).map((role, index) => (
                <div key={index} className="p-4 bg-green-50 rounded-2xl border border-green-100">
                  <h4 className="font-semibold text-gray-900 mb-2">{role}</h4>
                  <p className="text-green-600 font-bold text-lg">{salaryRange}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Target Companies */}
          <motion.div 
            className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
                <span className="text-white font-bold text-lg">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Target Companies</h3>
            </div>
            <div className="space-y-3">
              {companies.slice(0, 6).map((company, index) => (
                <motion.div 
                  key={index} 
                  className="flex items-center p-3 bg-purple-50 rounded-xl border border-purple-100"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                  <span className="text-gray-700 font-medium">{company}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Skills and Salary Insights */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Essential Skills */}
          <motion.div 
            className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h3 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Essential Skills
            </h3>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill, index) => (
                <motion.span 
                  key={index}
                  className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-sm font-semibold border border-blue-200"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Salary Insights */}
          <motion.div 
            className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h3 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Salary Insights
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-lg">Entry Level</span>
                <span className="font-bold text-green-600 text-xl">{salaryRange}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div 
                  className="bg-gradient-to-r from-green-400 to-blue-400 h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '65%' }}
                  transition={{ delay: 1, duration: 1 }}
                ></motion.div>
              </div>
              <p className="text-gray-500 text-sm">Based on Indian IT market data</p>
            </div>
          </motion.div>
        </div>

        {/* Action Plan */}
        <motion.div 
          className="bg-white rounded-3xl p-8 shadow-xl mb-10 border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Your Action Plan</h2>
          <div className="space-y-4">
            {actionPlan.map((step, index) => (
              <motion.div 
                key={index} 
                className="flex items-start p-4 bg-blue-50 rounded-2xl border border-blue-100"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-full flex items-center justify-center flex-shrink-0 mr-4 font-bold">
                  {index + 1}
                </div>
                <p className="text-gray-700 text-lg">{step}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Restart Button */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <button 
            onClick={onStartNewAssessment}
            className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            Start New Assessment
          </button>
          <p className="text-gray-500 mt-4">Discover your ideal tech career. Built with purpose.</p>
        </motion.div>
      </motion.div>
    </div>
  );
}