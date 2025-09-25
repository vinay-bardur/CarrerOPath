import React from 'react';

export default function Results({ result, userName, onRestart }) {
  if (!result) return null;

  // Use the actual property names from backend
  const careerRoles = result.roles || result.careerRoles || [];
  const salaryRange = result.salary_range || result.expectedSalary || "Salary information not available";
  const targetCompanies = result.companies || result.targetCompanies || [];
  const skills = result.skills || [];
  const rationale = result.rationale || "";

  // Roadmap URL mapping
  const roadmapMap = {
    "UX/UI Developer": "https://roadmap.sh/frontend",
    "Frontend Developer": "https://roadmap.sh/frontend", 
    "Backend Developer": "https://roadmap.sh/backend",
    "Full Stack Developer": "https://roadmap.sh/full-stack",
    "Data Analyst": "https://roadmap.sh/data-analyst",
    "Business Analyst": "https://roadmap.sh/business-intelligence-analyst",
    "Digital Marketing Associate": "https://roadmap.sh/digital-marketing",
    "Product Manager": "https://roadmap.sh/product-manager",
    "Software Engineer": "https://roadmap.sh/full-stack",
    "DevOps Engineer": "https://roadmap.sh/devops"
  };

  const getRoadmapUrl = (role) => {
    return roadmapMap[role] || "https://roadmap.sh";
  };

  // Create action plan from available data
  const actionPlan = [
    `Focus on developing: ${skills.slice(0, 3).join(', ')}`,
    `Explore opportunities at: ${targetCompanies.slice(0, 3).join(', ')}`,
    `Research roles in: ${careerRoles.slice(0, 2).join(' and ')}`,
    "Build portfolio projects to showcase your skills",
    "Network with professionals in your target industry"
  ];

  // Compute a displayable salary string
  const displaySalary = typeof salaryRange === 'string'
    ? salaryRange
    : (careerRoles[0] && salaryRange[careerRoles[0]]) || '₹6–12 LPA (fresher)';

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-light text-gray-900 mb-2">Your Career Blueprint{userName ? `, ${userName}` : ''}</h1>
        <p className="text-gray-600">Personalized recommendations based on your strengths</p>
      </div>

      {/* Rationale */}
      {rationale && (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-10">
          <h2 className="text-2xl font-normal text-gray-900 mb-4">Your Career Path Snapshot</h2>
          <p className="text-gray-700 text-lg leading-relaxed">{rationale}</p>
        </div>
      )}

      {/* Three Column Layout */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {/* SECTION 1: Recommended Roles */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-blue-600 font-semibold">1</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Recommended Roles</h3>
          </div>
          <div className="space-y-4">
            {careerRoles.slice(0, 3).map((role, index) => (
              <a
                key={index}
                href={getRoadmapUrl(role)}
                target="_blank"
                rel="noopener noreferrer"
                className="block border-b border-gray-100 pb-4 last:border-b-0 group transition-all duration-200 hover:bg-blue-50 hover:px-3 hover:-mx-3 rounded-lg"
              >
                <h4 className="font-medium text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {role}
                </h4>
              </a>
            ))}
          </div>
        </div>

        {/* SECTION 2: Expected Salary */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-green-600 font-semibold">2</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Expected Salary</h3>
          </div>
          <div className="space-y-4">
            {careerRoles.slice(0, 3).map((role, index) => (
              <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
                <h4 className="font-medium text-gray-900 mb-1">{role}</h4>
                <p className="text-green-600 font-semibold">{salaryRange}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: Target Companies */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-purple-600 font-semibold">3</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Target Companies</h3>
          </div>
          <div className="space-y-3">
            {targetCompanies.slice(0, 6).map((company, index) => (
              <div key={index} className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                <span className="text-gray-700">{company}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Sections: Skills Cloud + Salary Insights */}
      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        {/* Skills Cloud */}
        <div className="apple-card p-8">
          <h3 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Essential Skills
          </h3>
          <div className="flex flex-wrap gap-3">
            {skills.map((skill, index) => (
              <span 
                key={index}
                className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200/50"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Salary Insights */}
        <div className="apple-card p-8">
          <h3 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Salary Insights
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Entry Level</span>
              <span className="font-semibold text-green-600">{displaySalary}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full" style={{width: '40%'}}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Plan */}
      <div className="bg-blue-50 rounded-2xl p-8 mb-10">
        <h2 className="text-2xl font-normal text-gray-900 mb-4">Your Action Plan</h2>
        <div className="space-y-4">
          {actionPlan.map((step, index) => (
            <div key={index} className="flex items-start">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                {index + 1}
              </div>
              <p className="text-gray-700 text-lg">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Restart Button */}
      <div className="text-center">
        <button 
          onClick={onRestart}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-xl transition-colors"
        >
          Start New Assessment
        </button>
      </div>
    </div>
  );
}