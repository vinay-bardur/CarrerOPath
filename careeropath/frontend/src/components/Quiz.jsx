// import React, { useEffect, useState } from 'react';
// import { getQuestions } from '../utils/api';

// export default function Quiz({ userDetails, onQuizComplete }) {
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [questions, setQuestions] = useState([]);
//   const [answers, setAnswers] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [fetchError, setFetchError] = useState(null);
//   const [userInfo, setUserInfo] = useState({ name: '', age: '', gender: '' });

//   useEffect(() => {
//     setIsLoading(true);
//     setFetchError(null);
//     getQuestions()
//       .then((res) => {
//         const qs = res?.data?.quiz || res?.data?.questions || [];
//         setQuestions(qs);
//       })
//       .catch((err) => {
//         console.error('Failed to fetch questions:', err);
//         setFetchError('Unable to load questions. Please ensure the backend is running.');
//       })
//       .finally(() => setIsLoading(false));
//   }, []);

//   const handleAnswer = (questionId, answerIndex) => {
//     setAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
//   };

//   const handleNext = () => {
//     if (currentQuestion < questions.length - 1) {
//       setCurrentQuestion(prev => prev + 1);
//     }
//   };

//   const handlePrev = () => {
//     if (currentQuestion > 0) {
//       setCurrentQuestion(prev => prev - 1);
//     }
//   };

//   const handleUserInfoChange = (field, value) => {
//     setUserInfo(prev => ({ ...prev, [field]: value }));
//   };

//   const handleSubmit = async () => {
//     setIsSubmitting(true);
//     try {
//       const payload = {
//         user: {
//           name: userDetails?.name || "Anonymous",
//           age: userDetails?.age || 20,
//           gender: userDetails?.gender || "Other",
//           google_sub: "demo_user"
//         },
//         answers: answers
//       };

//       const response = await fetch('http://localhost:8000/submit-quiz', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(payload)
//       });

//       if (!response.ok) {
//         throw new Error('Failed to submit quiz');
//       }

//       await response.json();
      
//       onQuizComplete();

//     } catch (error) {
//       console.error('Error submitting quiz:', error);
//       alert('Error submitting quiz. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const total = questions.length || 10;
//   const allQuestionsAnswered = Object.keys(answers).length === total;

//   if (isLoading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[40vh]">
//         <div className="w-10 h-10 border-3 border-gray-300 border-t-[#0066CC] rounded-full animate-spin mb-4"></div>
//         <p className="text-gray-500 text-sm">Loading questions…</p>
//       </div>
//     );
//   }

//   if (fetchError) {
//     return (
//       <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-2xl shadow-sm border border-gray-200 text-center">
//         <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to load questions</h2>
//         <p className="text-gray-600 mb-6">{fetchError}</p>
//         <button
//           onClick={() => window.location.reload()}
//           className="py-3 px-6 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto">
//       {/* Progress Header */}
//       <div className="apple-card rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-2xl font-normal text-gray-900">Career Assessment</h2>
//           <span className="text-gray-600">Question {currentQuestion + 1} of {total}</span>
//         </div>
        
//         {/* Progress Bar */}
//         <div className="w-full bg-gray-200 rounded-full h-2">
//           <div 
//             className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
//             style={{ width: `${((currentQuestion + 1) / total) * 100}%` }}
//           ></div>
//         </div>
//       </div>

//       {/* User Info Form - Show only before starting quiz */}
//       {currentQuestion === 0 && Object.keys(answers).length === 0 && (
//         <div className="apple-card rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
//           <h3 className="text-lg font-medium text-gray-900 mb-4">Tell us about yourself</h3>
//           <div className="grid md:grid-cols-3 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
//               <input
//                 type="text"
//                 value={userInfo.name}
//                 onChange={(e) => handleUserInfoChange('name', e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Your name"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
//               <input
//                 type="number"
//                 value={userInfo.age}
//                 onChange={(e) => handleUserInfoChange('age', e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Your age"
//                 min="16"
//                 max="100"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
//               <select
//                 value={userInfo.gender}
//                 onChange={(e) => handleUserInfoChange('gender', e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="">Select</option>
//                 <option value="Male">Male</option>
//                 <option value="Female">Female</option>
//                 <option value="Other">Other</option>
//                 <option value="Prefer not to say">Prefer not to say</option>
//               </select>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Quiz Question */}
//       {questions[currentQuestion] && (
//         <div className="apple-card rounded-2xl p-6 shadow-sm border border-gray-100">
//           <h3 className="text-lg font-medium text-gray-900 mb-6 text-center">
//             {questions[currentQuestion].q || questions[currentQuestion].text}
//           </h3>
//           <div className="grid gap-3">
//             {(questions[currentQuestion].options || []).map((option, index) => {
//               const qId = questions[currentQuestion].id ?? currentQuestion;
//               const selected = answers[qId] === index;
//               return (
//                 <button
//                   key={index}
//                   onClick={() => handleAnswer(qId, index)}
//                   className={`w-full text-left p-4 rounded-xl border transition-colors ${selected ? 'border-blue-600 bg-blue-50 text-blue-900' : 'border-gray-300 bg-white text-gray-800 hover:border-blue-500 hover:bg-blue-50'}`}
//                 >
//                   {option}
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//       )}

//       {/* Navigation Buttons */}
//       <div className="flex justify-between mt-8">
//         <button
//           onClick={handlePrev}
//           disabled={currentQuestion === 0}
//           className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//         >
//           Previous
//         </button>

//         {currentQuestion < total - 1 ? (
//           <button
//             onClick={handleNext}
//             disabled={(() => {
//               const qId = questions[currentQuestion]?.id ?? currentQuestion;
//               return !(qId in answers);
//             })()}
//             className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
//           >
//             Next
//           </button>
//         ) : (
//           <button
//             onClick={handleSubmit}
//             disabled={!allQuestionsAnswered || isSubmitting}
//             className="px-6 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700"
//           >
//             {isSubmitting ? 'Submitting...' : 'See Your Results'}
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }






import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { getQuestions } from '../utils/api';

// Sound effects setup
let sounds = null;
try {
  // Only initialize sounds in browser environment
  if (typeof window !== 'undefined') {
    const { Howl } = require('howler');
    sounds = {
      click: new Howl({ 
        src: ["/sounds/sound.mp3"],
        volume: 0.3,
        preload: true
      }),
      complete: new Howl({ 
        src: ["/sounds/success.mp3"],
        volume: 0.5,
        preload: true
      })
    };
  }
} catch (error) {
  console.log('Sound files not loaded:', error);
}

export default function Quiz({ userDetails, onQuizComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

  // Detect mobile device
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Enter' && selectedOption !== null) {
        handleNext();
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedOption, currentQuestion]);

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
    setSelectedOption(answerIndex);
    playSound('click');
    
    // Auto-advance on mobile after selection
    if (isMobile) {
      setTimeout(() => {
        handleNext();
      }, 500); // Small delay to show selection
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedOption(null);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      const prevQuestionId = questions[currentQuestion - 1]?.id ?? (currentQuestion - 1);
      setSelectedOption(answers[prevQuestionId] ?? null);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    playSound('complete');
    
    try {
      const payload = {
        user: {
          name: userDetails?.name || "Anonymous",
          age: userDetails?.age || 20,
          gender: userDetails?.gender || "Other",
          google_sub: "demo_user"
        },
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
      
      // Store results for the Results page
      localStorage.setItem('careerRecommendations', JSON.stringify(result));
      
      onQuizComplete();

    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Error submitting quiz. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const total = questions.length || 15;
  const allQuestionsAnswered = Object.keys(answers).length === total;
  const currentQuestionId = questions[currentQuestion]?.id ?? currentQuestion;
  const canProceed = currentQuestionId in answers;

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
          <p className="text-gray-600 text-lg">Loading your assessment...</p>
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
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Unable to load assessment</h2>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <motion.div 
        className="w-full max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Progress Header */}
        <motion.div 
          className="bg-white rounded-3xl shadow-xl overflow-hidden mb-6"
          layout
        >
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-center">
            <h2 className="text-2xl font-semibold text-white">Career Assessment</h2>
            <p className="text-blue-100 mt-1">Question {currentQuestion + 1} of {total}</p>
          </div>
          
          {/* Progress Bar */}
          <div className="p-6">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestion + 1) / total) * 100}%` }}
                transition={{ duration: 0.5 }}
              ></motion.div>
            </div>
            <p className="text-center text-gray-600 mt-2 text-sm">
              {Math.round(((currentQuestion + 1) / total) * 100)}% Complete
            </p>
          </div>
        </motion.div>

        {/* Quiz Question */}
        {questions[currentQuestion] && (
          <motion.div 
            className="bg-white rounded-3xl shadow-xl p-8"
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h3 className="text-xl font-medium text-gray-900 mb-8 text-center leading-relaxed">
              {questions[currentQuestion].q || questions[currentQuestion].text}
            </h3>
            
            <div className="space-y-4">
              {(questions[currentQuestion].options || []).map((option, index) => {
                const selected = answers[currentQuestionId] === index;
                return (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswer(currentQuestionId, index)}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 ${
                      selected 
                        ? 'border-blue-500 bg-blue-50 text-blue-900 shadow-md transform scale-[1.02]' 
                        : 'border-gray-200 bg-white text-gray-800 hover:border-blue-300 hover:bg-blue-50 hover:shadow-sm'
                    }`}
                    whileTap={{ scale: 0.98 }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full border-2 mr-3 flex-shrink-0 ${
                        selected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                      }`}>
                        {selected && (
                          <div className="w-full h-full rounded-full bg-white transform scale-50"></div>
                        )}
                      </div>
                      <span className="flex-1">{option}</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Mobile hint */}
            {isMobile && !canProceed && (
              <p className="text-center text-gray-500 text-sm mt-6">
                Tap an option to continue
              </p>
            )}

            {/* Desktop hint */}
            {!isMobile && canProceed && (
              <p className="text-center text-gray-500 text-sm mt-6">
                Press Enter or click Next to continue
              </p>
            )}
          </motion.div>
        )}

        {/* Navigation Buttons - Hidden on mobile for selected questions */}
        {(!isMobile || !canProceed || currentQuestion === total - 1) && (
          <motion.div 
            className="flex justify-between mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <button
              onClick={handlePrev}
              disabled={currentQuestion === 0}
              className="px-6 py-3 text-gray-600 bg-white border-2 border-gray-300 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
            >
              Previous
            </button>

            {currentQuestion < total - 1 ? (
              <button
                onClick={handleNext}
                disabled={!canProceed}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
              >
                Next
              </button>
            ) : (
              <motion.button
                onClick={handleSubmit}
                disabled={!allQuestionsAnswered || isSubmitting}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-800 text-white rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </span>
                ) : (
                  'See Your Results'
                )}
              </motion.button>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}