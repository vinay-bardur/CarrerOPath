import React, { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import Home from "./components/Home";
import Auth from "./components/Auth";
import UserDetails from "./components/UserDetails";
import Quiz from "./components/Quiz";
import Results from "./components/Results";

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [userDetails, setUserDetails] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
      } else {
        setCurrentPage('home');
      }
    }
  }, [loading]);

  const handleGetStarted = () => {
    if (user) {
      setCurrentPage('details');
      window.history.pushState({}, '', '/details');
    } else {
      setCurrentPage('auth');
      window.history.pushState({}, '', '/auth');
    }
  };

  const handleAuthSuccess = (authUser) => {
    setUser(authUser);
    setCurrentPage('details');
    window.history.pushState({}, '', '/details');
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

  const handleStartNewAssessment = async () => {
    localStorage.removeItem('userDetails');
    localStorage.removeItem('careerRecommendations');
    setUserDetails(null);
    setCurrentPage('home');
    window.history.pushState({}, '', '/');
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