import React, { useEffect, useState, useCallback } from "react";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";
import Quiz from "./components/Quiz";
import Results from "./components/Results";
import UserDetails from "./components/UserDetails";
import { supabase } from "./lib/supabase";

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [userDetails, setUserDetails] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previousResults, setPreviousResults] = useState(null);

  // Function to check for previous quiz results via backend API
  const checkPreviousResults = async (userId) => {
    try {
      console.log('Fetching results for user ID:', userId);
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
      const response = await fetch(`${backendUrl}/user/${userId}/results`);
      console.log('API Response status:', response.status);
      
      const result = await response.json();
      console.log('API Response data:', result);
      
      if (result.success) {
        console.log('Previous results found:', result.data);
        return result.data;
      } else {
        console.log('No previous results found:', result.message);
        return null;
      }
    } catch (error) {
      console.error('Error checking previous results:', error);
      return null;
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading) {
      const savedDetails = localStorage.getItem('userDetails');
      if (savedDetails) {
        setUserDetails(JSON.parse(savedDetails));
      }

      const path = window.location.pathname;
      if (path === '/results') {
        setCurrentPage('results');
      } else if (path === '/quiz') {
        setCurrentPage('quiz');
      } else if (path === '/details') {
        setCurrentPage('details');
      } else if (path === '/auth') {
        setCurrentPage('auth');
      } else if (path === '/dashboard') {
        setCurrentPage('dashboard');
      } else {
        setCurrentPage('home');
      }
    }
  }, [loading]);

  const [submitting, setSubmitting] = useState(false);
  
  const handleGetStarted = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    
    console.log('get_started_begin t:', performance.now());
    
    try {
      if (user && !loading) {
        // Navigate immediately, fetch in background
        setCurrentPage('details');
        window.history.pushState({}, '', '/details');
        console.log('navigating_to_details t:', performance.now());
        
        // Background fetch for dashboard data
        setTimeout(async () => {
          console.log('results_fetch_begin t:', performance.now());
          const fetchStart = performance.now();
          
          const results = await checkPreviousResults(user.id);
          
          const fetchEnd = performance.now();
          console.log('results_fetch_end t:', fetchEnd, 'dt:', fetchEnd - fetchStart, 'ok:', !!results);
          
          setPreviousResults(results);
        }, 0);
      } else {
        setCurrentPage('auth');
        window.history.pushState({}, '', '/auth');
      }
    } finally {
      setSubmitting(false);
    }
  }, [user, loading, submitting]);

  const handleAuthSuccess = async (authUser) => {
    setUser(authUser);
    
    // Check for previous results
    const results = await checkPreviousResults(authUser.id);
    setPreviousResults(results);
    
    if (results) {
      // User has previous results, go to dashboard
      setCurrentPage('dashboard');
      window.history.pushState({}, '', '/dashboard');
    } else {
      // New user, go to user details
      setCurrentPage('details');
      window.history.pushState({}, '', '/details');
    }
  };

  const handleContinueToQuiz = async (details) => {
    setUserDetails(details);
    
    if (user) {
      try {
        const { error } = await supabase
          .from('users')
          .upsert({
            auth_id: user.id,
            email: user.email,
            name: details.name,
            age: details.age,
            gender: details.gender,
            updated_at: new Date().toISOString()
          });

        if (error) console.error('Error saving user details:', error);
      } catch (error) {
        console.error('Error with database:', error);
      }
    }

    setCurrentPage('quiz');
    window.history.pushState({}, '', '/quiz');
  };

  const handleQuizComplete = () => {
    setCurrentPage('results');
    window.history.pushState({}, '', '/results');
  };

  const handleViewPrevious = () => {
    console.log('continue_click t0:', performance.now());
    setCurrentPage('results');
    window.history.pushState({}, '', '/results');
  };

  const handleTakeNewQuiz = () => {
    setCurrentPage('details');
    window.history.pushState({}, '', '/details');
  };

  const handleStartNewAssessment = async () => {
    localStorage.removeItem('userDetails');
    localStorage.removeItem('careerRecommendations');
    setUserDetails(null);
    setCurrentPage('dashboard');
    window.history.pushState({}, '', '/dashboard');
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserDetails(null);
    localStorage.clear();
    setCurrentPage('home');
    window.history.pushState({}, '', '/');
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/results') {
        setCurrentPage('results');
      } else if (path === '/quiz') {
        setCurrentPage('quiz');
      } else if (path === '/details') {
        setCurrentPage('details');
      } else if (path === '/auth') {
        setCurrentPage('auth');
      } else if (path === '/dashboard') {
        setCurrentPage('dashboard');
      } else {
        setCurrentPage('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-gray-600">Loading CareerPath...</p>
        </div>
      </div>
    );
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onGetStarted={handleGetStarted} user={user} onSignOut={handleSignOut} />;
      
      case 'auth':
        return <Auth onAuthSuccess={handleAuthSuccess} />;
      
      case 'dashboard':
        return (
          <Dashboard 
            user={user}
            previousResults={previousResults}
            onViewPrevious={handleViewPrevious}
            onTakeNewQuiz={handleTakeNewQuiz}
            onSignOut={handleSignOut}
          />
        );
      
      case 'details':
        return <UserDetails onContinueToQuiz={handleContinueToQuiz} user={user} />;
      
      case 'quiz':
        return (
          <Quiz 
            userDetails={userDetails} 
            onQuizComplete={handleQuizComplete}
            user={user}
            onSignOut={handleSignOut}
          />
        );
      
      case 'results':
        return (
          <Results 
            userDetails={userDetails}
            onStartNewAssessment={handleStartNewAssessment}
            user={user}
            previousResults={previousResults}
          />
        );
      
      default:
        return <Home onGetStarted={handleGetStarted} user={user} onSignOut={handleSignOut} />;
    }
  };

  return (
    <div className="App">
      {renderCurrentPage()}
    </div>
  );
}

export default App;