import React, { useState } from 'react';
import Quiz from './components/Quiz';
import Results from './components/Results';

function App() {
  // This state holds the results from the backend after quiz submission
  const [quizResult, setQuizResult] = useState(null);

  // Function to handle quiz completion, passed down to the Quiz component
  const handleQuizComplete = (resultData) => {
    setQuizResult(resultData);
  };

  // Function to restart the quiz, passed down to the Results component
  const handleRestartQuiz = () => {
    setQuizResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Navigation / Header Bar - Apple-style */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">CareerPath</h1>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {quizResult ? 'Your Results' : 'Find Your Path in Tech'}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {quizResult ? (
          <Results result={quizResult.result} userName={quizResult.userName} onRestart={handleRestartQuiz} />
        ) : (
          <Quiz onQuizComplete={handleQuizComplete} />
        )}
      </main>

      {/* Subtle Footer - Apple-style */}
      <footer className="mt-16 border-t border-gray-200/50">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <p className="text-center text-sm text-gray-500">
            Discover your ideal tech career. Built with purpose.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App