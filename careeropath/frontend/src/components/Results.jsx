import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

export default function Results({ userDetails, onStartNewAssessment }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const savedResults = localStorage.getItem('careerRecommendations');
    if (savedResults) {
      try {
        const parsedResults = JSON.parse(savedResults);
        console.log('Loaded results:', parsedResults);
        setResult(parsedResults);
        
        setTimeout(() => {
          setShowResults(true);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error parsing results:', error);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const getUserGreeting = () => {
    if (userDetails?.name) {
      return `Hello, ${userDetails.name.toUpperCase()}`;
    }
    return "Your Career Journey";
  };

  const getSubtitle = () => {
    if (userDetails?.name) {
      return "Personalized recommendations based on your strengths";
    }
    return "Discover your ideal career path";
  };


  const roadmapMap = {
    "UX/UI Developer": "https://roadmap.sh/ux-design",
    "UI/UX Designer": "https://roadmap.sh/ux-design",
    "Frontend Developer": "https://roadmap.sh/frontend", 
    "Backend Developer": "https://roadmap.sh/backend",
    "Full Stack Developer": "https://roadmap.sh/full-stack",
    "Data Analyst": "https://roadmap.sh/data-analyst",
    "Data Scientist": "https://roadmap.sh/ai-data-scientist",
    "Business Analyst": "https://roadmap.sh/bi-analyst",
    "Product Manager": "https://roadmap.sh/product-manager",
    "Software Engineer": "https://roadmap.sh/software-architect",
    "DevOps Engineer": "https://roadmap.sh/devops",
    "Security Analyst": "https://roadmap.sh/cyber-security",
    "Cybersecurity": "https://roadmap.sh/cyber-security",
    "Backend Engineer": "https://roadmap.sh/backend",
    "Data Engineer": "https://roadmap.sh/data-engineer",
    "Mobile Developer": "https://roadmap.sh/ios",
    "Cloud Engineer": "https://roadmap.sh/aws",
    "Machine Learning Engineer": "https://roadmap.sh/machine-learning"
  };

  const getRoadmapUrl = (role) => {
    return roadmapMap[role] || "https://roadmap.sh";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-6 mx-auto"></div>
          <p className="text-blue-600 text-lg font-medium">Preparing your career blueprint...</p>
        </motion.div>
      </div>
    );
  }

  if (!result || !showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <motion.div 
          className="max-w-md mx-auto bg-white rounded-3xl shadow-xl p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Results Found</h2>
          <p className="text-gray-600 mb-6">Please complete the assessment to see your career recommendations.</p>
          <button
            onClick={onStartNewAssessment}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold shadow-lg hover:shadow-xl"
          >
            Start Assessment
          </button>
        </motion.div>
      </div>
    );
  }

  const roles = result.roles || result.recommended_roles || ["Software Engineer", "Full Stack Developer"];
  const companies = result.companies || result.target_companies || ["TCS", "Infosys", "Wipro", "HCL"];
  const salaryRange = result.salary_range || result.expectedSalary || "₹6,00,000 - ₹10,00,000";
  const skills = result.skills || result.essential_skills || ["JavaScript", "Python", "React", "SQL"];
  const rationale = result.rationale || "Based on your assessment, you show strong potential for technology roles in the Indian IT industry.";

  const actionPlan = [
    `Focus on developing: ${skills.slice(0, 3).join(', ') || 'core technical skills'}`,
    `Explore opportunities at: ${companies.slice(0, 3).join(', ') || 'leading tech companies'}`,
    `Research roles in: ${roles.slice(0, 2).join(' and ') || 'your recommended fields'}`,
    "Build portfolio projects to showcase your skills",
    "Network with professionals in your target industry"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <motion.div 
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {getUserGreeting()}
          </h1>
          <p className="text-xl text-gray-600 mb-2">CareerOPath</p>
          <p className="text-lg text-gray-500">{getSubtitle()}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          
          <motion.div 
            className="bg-white rounded-2xl shadow-lg p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4">
                <span className="text-white font-bold text-lg">1</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900"> Recommended Roles</h2>
            </div>
            <div className="space-y-4">
              {roles.slice(0, 3).map((role, index) => (
                <motion.a
                  key={index}
                  href={getRoadmapUrl(role)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500 hover:bg-blue-100 hover:border-blue-600 transition-all duration-300 group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <h3 className="font-semibold text-gray-800 text-lg group-hover:text-blue-600 transition-colors">
                    {role}
                  </h3>
                  <p className="text-blue-600 text-sm mt-1 flex items-center">
                    View learning roadmap 
                    <span className="ml-1 transform group-hover:translate-x-1 transition-transform">→</span>
                  </p>
                </motion.a>
              ))}
            </div>
          </motion.div>

          
          <motion.div 
            className="bg-white rounded-2xl shadow-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mr-4">
                <span className="text-white font-bold text-lg">2</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900"> Expected Salary</h2>
            </div>
            <div className="bg-green-50 rounded-lg p-6 border-l-4 border-green-500">
              <p className="text-2xl font-bold text-gray-800 mb-2">{salaryRange}</p>
              <p className="text-green-600 font-medium">Entry Level • India</p>
              <div className="w-full bg-green-200 rounded-full h-2 mt-3">
                <div className="bg-green-500 h-2 rounded-full w-3/4"></div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white rounded-2xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
                <span className="text-white font-bold text-lg">3</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900"> Target Companies</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {companies.slice(0, 6).map((company, index) => (
                <motion.div 
                  key={index} 
                  className="bg-purple-50 rounded-lg p-3 text-center border border-purple-200 hover:bg-purple-100 transition-colors"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <span className="font-semibold text-gray-800">{company}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6"> Essential Skills</h2>
          <div className="flex flex-wrap gap-3">
            {skills.map((skill, index) => (
              <motion.span 
                key={index}
                className="px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 rounded-full font-semibold text-sm border border-orange-200 hover:scale-105 transition-transform"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {rationale && (
          <motion.div 
            className="bg-white rounded-2xl shadow-lg p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4"> Career Analysis</h2>
            <p className="text-gray-700 leading-relaxed text-lg">{rationale}</p>
          </motion.div>
        )}

        <motion.div 
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6"> Your Action Plan</h2>
          <div className="space-y-4">
            {actionPlan.map((step, index) => (
              <motion.div 
                key={index} 
                className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 hover:shadow-md transition-all"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center mr-4 font-bold text-sm">
                  {index + 1}
                </div>
                <span className="text-gray-700 text-lg">{step}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <button 
            onClick={onStartNewAssessment}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg border-2 border-blue-600 hover:border-blue-700"
          >
            Start New Assessment
          </button>
          <p className="text-gray-500 mt-4">Shape Your Future. Designed for You</p>
        </motion.div>
      </motion.div>
    </div>
  );
}