import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { getQuestions } from '../utils/api';

export default function Quiz({ userDetails, onQuizComplete, user, onSignOut }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [sounds, setSounds] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const initSounds = async () => {
      try {
        const { Howl } = await import('howler');
        setSounds({
          click: new Howl({ 
            src: ["/sounds/sound2.mp3"],
            volume: 0.4,
            preload: true
          }),
          success: new Howl({ 
            src: ["/sounds/success.mp3"],
            volume: 0.6,
            preload: true
          })
        });
      } catch (error) {
        console.log('Sound files not loaded:', error);
      }
    };
    
    initSounds();
  }, []);

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

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        const currentQuestionId = questions[currentQuestion]?.id ?? currentQuestion;
        const hasAnswered = currentQuestionId in answers;
        
        if (hasAnswered) {
          if (currentQuestion === questions.length - 1) {
            handleSubmit();
          } else {
            handleNext();
          }
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentQuestion, answers, questions]);

  const playSound = (soundName) => {
    try {
      if (sounds && sounds[soundName]) {
        sounds[soundName].play();
      }
    } catch (error) {
      console.log('Could not play sound:', error);
    }
  };

  const handleAnswer = (questionId, answerIndex) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
    playSound('click');
    
    if (isMobile) {
      setTimeout(() => {
        if (currentQuestion === questions.length - 1) {
          return;
        }
        handleNext();
      }, 600);
    }
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

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const payload = {
        user: {
          name: userDetails?.name || "Anonymous",
          age: userDetails?.age || 20,
          gender: userDetails?.gender || "Other",
          google_sub: user?.id || "demo_user"  // Use actual user ID
        },
        answers: answers
      };

      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
      const response = await fetch(`${backendUrl}/submit-quiz`, {
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
      localStorage.setItem('careerRecommendations', JSON.stringify(result));
      console.log('Quiz submitted successfully, backend will handle database save');
      
      playSound('success');
      
      setTimeout(() => {
        onQuizComplete();
      }, 1200);
      
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Error submitting quiz. Please try again.');
      setIsSubmitting(false);
    }
  };

  const total = questions.length || 15;
  const answeredCount = Object.keys(answers).length;
  const progressPercentage = Math.round((answeredCount / total) * 100);
  const currentQuestionId = questions[currentQuestion]?.id ?? currentQuestion;
  const hasAnsweredCurrent = currentQuestionId in answers;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mb-6 mx-auto"></div>
          <p className="text-gray-600 text-lg">Loading CareerOPath...</p>
        </motion.div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <motion.div 
          className="max-w-md mx-auto bg-white rounded-3xl shadow-xl p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Unable to load</h2>
          <p className="text-gray-600 mb-6">{fetchError}</p>
          <button
            onClick={() => window.location.reload()}
            className="py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl hover:shadow-lg transition-all"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center ${isMobile ? 'p-3' : 'p-4'} relative`}>
      {user && onSignOut && (
        <div className={`absolute ${isMobile ? 'top-4 right-4' : 'top-6 right-6'} z-10`}>
          <button
            onClick={onSignOut}
            className={`${isMobile ? 'px-4 py-2 text-sm' : 'px-6 py-3'} bg-white/90 backdrop-blur-sm border border-gray-200 text-gray-700 font-medium rounded-full shadow-sm hover:shadow-md hover:bg-white transition-all duration-300`}
          >
            Sign Out
          </button>
        </div>
      )}

      <motion.div
        className={`w-full ${isMobile ? 'max-w-sm' : 'max-w-4xl'}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className={`bg-white/95 backdrop-blur-sm rounded-3xl shadow-lg overflow-hidden ${isMobile ? 'mb-4' : 'mb-8'} border border-white/20`}
          layout
        >
          <div className={`bg-gradient-to-r from-blue-500 to-blue-600 ${isMobile ? 'p-4' : 'p-6'} text-white`}>
            <div className="flex justify-between items-center">
              <h1 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-semibold`}>CareerOPath</h1>
              <span className={`text-blue-100 ${isMobile ? 'text-sm' : 'text-base'}`}>{currentQuestion + 1} of {total}</span>
            </div>
          </div>
          
          <div className={`${isMobile ? 'p-4' : 'p-6'}`}>
            <div className={`w-full bg-blue-100 rounded-full ${isMobile ? 'h-2' : 'h-3'} mb-3`}>
              <motion.div 
                className={`bg-gradient-to-r from-blue-500 to-blue-600 ${isMobile ? 'h-2' : 'h-3'} rounded-full shadow-sm`}
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              ></motion.div>
            </div>
            <p className={`text-blue-600 font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>{progressPercentage}% Complete • {answeredCount} of {total} answered</p>
          </div>
        </motion.div>
        {questions[currentQuestion] && (
          <motion.div
            className={`bg-white/95 backdrop-blur-sm rounded-3xl shadow-lg ${isMobile ? 'p-5' : 'p-8'} border border-white/20`}
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-medium text-gray-900 ${isMobile ? 'mb-6' : 'mb-10'} text-center leading-relaxed max-w-3xl mx-auto`}>
              {questions[currentQuestion].q || questions[currentQuestion].text}
            </h2>
            <div className={`${isMobile ? 'space-y-3' : 'space-y-4'} max-w-3xl mx-auto`}>
              {(questions[currentQuestion].options || []).map((option, index) => {
                const selected = answers[currentQuestionId] === index;
                return (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswer(currentQuestionId, index)}
                    className={`w-full text-left ${isMobile ? 'p-4' : 'p-6'} rounded-2xl border transition-all duration-300 ${
                      selected 
                        ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-900 shadow-md' 
                        : 'border-gray-200 bg-white/90 text-gray-800 hover:border-blue-300 hover:bg-blue-50 hover:shadow-sm'
                    }`}
                    whileTap={{ scale: 0.98 }}
                    whileHover={{ scale: isMobile ? 1 : (selected ? 1.01 : 1.005) }}
                  >
                    <div className="flex items-center">
                      <div className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} rounded-full border-2 ${isMobile ? 'mr-3' : 'mr-4'} flex-shrink-0 transition-all ${
                        selected ? 'border-blue-500 bg-blue-500 shadow-sm' : 'border-gray-300'
                      }`}>
                        {selected && (
                          <div className="w-full h-full rounded-full bg-white transform scale-50"></div>
                        )}
                      </div>
                      <span className={`flex-1 ${isMobile ? 'text-sm' : 'text-base'} leading-relaxed`}>{option}</span>
                      {selected && (
                        <div className={`${isMobile ? 'ml-2' : 'ml-4'} text-blue-500`}>
                          <svg className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
            {!hasAnsweredCurrent && (
              <p className="text-center text-blue-400 text-sm mt-8 font-medium">
                {isMobile ? 'Tap an option to continue' : 'Select an option and press Enter or Next'}
              </p>
            )}
            {hasAnsweredCurrent && currentQuestion === questions.length - 1 && (
              <div className="text-center mt-8 p-4 bg-green-50 rounded-2xl border border-green-200">
                <p className="text-green-600 text-sm font-medium">
                  {isMobile ? 'Tap "Get Results" to see your career path' : 'Press Enter or click "Get Results"'}
                </p>
              </div>
            )}
          </motion.div>
        )}
        <motion.div
          className={`flex justify-between ${isMobile ? 'mt-6' : 'mt-8'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={handlePrev}
            disabled={currentQuestion === 0}
            className={`${isMobile ? 'px-6 py-3 text-sm' : 'px-8 py-4'} text-gray-600 bg-white/90 border border-gray-200 rounded-full disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white hover:shadow-sm transition-all font-medium`}
          >
            Previous
          </button>

          {currentQuestion < total - 1 ? (
            <button
              onClick={handleNext}
              disabled={!hasAnsweredCurrent}
              className={`${isMobile ? 'px-6 py-3 text-sm' : 'px-8 py-4'} bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-full disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-md transition-all font-medium`}
            >
              Next
            </button>
          ) : (
            <motion.button
              onClick={handleSubmit}
              disabled={!hasAnsweredCurrent || isSubmitting}
              className={`${isMobile ? 'px-6 py-3 text-sm' : 'px-8 py-4'} bg-gradient-to-r from-green-600 to-green-800 text-white rounded-full disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-md transition-all font-medium`}
              whileHover={{ scale: hasAnsweredCurrent ? (isMobile ? 1.02 : 1.05) : 1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className={`animate-spin -ml-1 mr-3 ${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-white`} fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isMobile ? 'Analyzing...' : 'Analyzing your path...'}
                </span>
              ) : (
                'Get Results'
              )}
            </motion.button>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}