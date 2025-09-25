import React, { useEffect, useState } from 'react';
import { getQuestions } from '../utils/api';

export default function Quiz({ onQuizComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [userInfo, setUserInfo] = useState({ name: '', age: '', gender: '' });

  useEffect(() => {
    setIsLoading(true);
    setFetchError(null);
    getQuestions()
      .then((res) => {
        const qs = res?.data?.quiz || res?.data?.questions || [];
        setQuestions(qs);
      })
      .catch((err) => {
        console.error('Failed to fetch questions:', err);
        setFetchError('Unable to load questions. Please ensure the backend is running.');
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleAnswer = (questionId, answerIndex) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleUserInfoChange = (field, value) => {
    setUserInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Use safe defaults if user info not provided
      const safeUser = {
        name: userInfo.name || 'Guest',
        age: parseInt(userInfo.age || '20'),
        gender: userInfo.gender || 'unspecified',
        google_sub: `user_${Date.now()}`
      };
      const payload = {
        user: safeUser,
        answers: answers
      };

      const response = await fetch('http://localhost:8000/submit-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to submit quiz');
      }

      const result = await response.json();
      
      // TRANSFORM THE BACKEND RESPONSE TO MATCH FRONTEND EXPECTATIONS
      const transformedResult = {
        careerRoles: result.roles || [],
        expectedSalary: result.salary_range || "Salary information not available",
        targetCompanies: result.companies || [],
        skills: result.skills || [],
        rationale: result.rationale || "",
        // Create action plan from the data we have
        actionPlan: [
          `Focus on developing skills in: ${(result.skills || []).slice(0, 3).join(', ')}`,
          `Research opportunities at: ${(result.companies || []).slice(0, 3).join(', ')}`,
          `Prepare for roles in: ${(result.roles || []).slice(0, 2).join(' and ')}`,
          "Build projects to showcase your abilities",
          "Network with professionals in your target industry"
        ]
      };

      onQuizComplete({
        result: transformedResult,
        userName: userInfo.name
      });

    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Error submitting quiz. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const total = questions.length || 10;
  const allQuestionsAnswered = Object.keys(answers).length === total;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <div className="w-10 h-10 border-3 border-gray-300 border-t-[#0066CC] rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 text-sm">Loading questions…</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-2xl shadow-sm border border-gray-200 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to load questions</h2>
        <p className="text-gray-600 mb-6">{fetchError}</p>
        <button
          onClick={() => window.location.reload()}
          className="py-3 px-6 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Header */}
      <div className="apple-card rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-normal text-gray-900">Career Assessment</h2>
          <span className="text-gray-600">Question {currentQuestion + 1} of {total}</span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / total) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* User Info Form - Show only before starting quiz */}
      {currentQuestion === 0 && Object.keys(answers).length === 0 && (
        <div className="apple-card rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Tell us about yourself</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={userInfo.name}
                onChange={(e) => handleUserInfoChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
              <input
                type="number"
                value={userInfo.age}
                onChange={(e) => handleUserInfoChange('age', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your age"
                min="16"
                max="100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                value={userInfo.gender}
                onChange={(e) => handleUserInfoChange('gender', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Quiz Question */}
      {questions[currentQuestion] && (
        <div className="apple-card rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-6 text-center">
            {questions[currentQuestion].q || questions[currentQuestion].text}
          </h3>
          <div className="grid gap-3">
            {(questions[currentQuestion].options || []).map((option, index) => {
              const qId = questions[currentQuestion].id ?? currentQuestion;
              const selected = answers[qId] === index;
              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(qId, index)}
                  className={`w-full text-left p-4 rounded-xl border transition-colors ${selected ? 'border-blue-600 bg-blue-50 text-blue-900' : 'border-gray-300 bg-white text-gray-800 hover:border-blue-500 hover:bg-blue-50'}`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={handlePrev}
          disabled={currentQuestion === 0}
          className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Previous
        </button>

        {currentQuestion < total - 1 ? (
          <button
            onClick={handleNext}
            disabled={(() => {
              const qId = questions[currentQuestion]?.id ?? currentQuestion;
              return !(qId in answers);
            })()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!allQuestionsAnswered || isSubmitting}
            className="px-6 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700"
          >
            {isSubmitting ? 'Submitting...' : 'See Your Results'}
          </button>
        )}
      </div>
    </div>
  );
}