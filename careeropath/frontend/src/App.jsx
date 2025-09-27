import React, { useState, useEffect } from "react";
import Home from "./components/Home";
import UserDetails from "./components/UserDetails";
import Quiz from "./components/Quiz";
import Results from "./components/Results";

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [userDetails, setUserDetails] = useState(null);

  // Check if user has completed details on app load
  useEffect(() => {
    const savedDetails = localStorage.getItem('userDetails');
    if (savedDetails) {
      setUserDetails(JSON.parse(savedDetails));
    }

    // Check URL path to determine page
    const path = window.location.pathname;
    if (path === '/results') {
      setCurrentPage('results');
    } else if (path === '/quiz') {
      setCurrentPage('quiz');
    } else if (path === '/details') {
      setCurrentPage('details');
    } else {
      setCurrentPage('home');
    }
  }, []);

  // Navigation handlers
  const handleGetStarted = () => {
    setCurrentPage('details');
    window.history.pushState({}, '', '/details');
  };

  const handleContinueToQuiz = (details) => {
    setUserDetails(details);
    setCurrentPage('quiz');
    window.history.pushState({}, '', '/quiz');
  };

  const handleQuizComplete = () => {
    setCurrentPage('results');
    window.history.pushState({}, '', '/results');
  };

  const handleStartNewAssessment = () => {
    // Clear stored data
    localStorage.removeItem('userDetails');
    localStorage.removeItem('careerRecommendations');
    setUserDetails(null);
    setCurrentPage('home');
    window.history.pushState({}, '', '/');
  };

  // Handle browser back button
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/results') {
        setCurrentPage('results');
      } else if (path === '/quiz') {
        setCurrentPage('quiz');
      } else if (path === '/details') {
        setCurrentPage('details');
      } else {
        setCurrentPage('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Render current page
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onGetStarted={handleGetStarted} />;
      
      case 'details':
        return <UserDetails onContinueToQuiz={handleContinueToQuiz} />;
      
      case 'quiz':
        return (
          <Quiz 
            userDetails={userDetails} 
            onQuizComplete={handleQuizComplete} 
          />
        );
      
      case 'results':
        return (
          <Results 
            userDetails={userDetails}
            onStartNewAssessment={handleStartNewAssessment}
          />
        );
      
      default:
        return <Home onGetStarted={handleGetStarted} />;
    }
  };

  return (
    <div className="App">
      {renderCurrentPage()}
    </div>
  );
}

export default App;