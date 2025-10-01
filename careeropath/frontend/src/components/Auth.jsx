import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import logo from '../assets/logo.png';
import bluecap from '../assets/bluecap.png';

export default function Auth({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      
      if (error) throw error;
      
    } catch (error) {
      console.error('Error with Google sign-in:', error.message);
      setMessage('Error signing in with Google. Please try again.');
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });

        if (error) throw error;
        
        onAuthSuccess(data.user);
        
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: undefined
          }
        });

        if (error) throw error;

        if (data.user) {
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password
          });

          if (signInError) {
            onAuthSuccess(data.user);
            setMessage('Account created! You may need to verify your email later.');
          } else {
            onAuthSuccess(signInData.user);
            setMessage('Account created and signed in successfully!');
          }
        }
      }
    } catch (error) {
      console.error('Auth error:', error.message);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-100 to-purple-100 items-center justify-center p-12">
        <motion.div 
          className="text-center max-w-md"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="w-32 h-32 mx-auto mb-8 flex items-center justify-center">
            <img 
              src={logo} 
              alt="CareerOPath Logo" 
              className="w-full h-full object-contain"
            />
          </div>

          <h1 className="text-4xl font-light text-gray-900 mb-4">
            Discover Your Perfect Career Path
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Join thousands who found their ideal career through personalized matching
          </p>
        </motion.div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div 
          className="w-full max-w-md"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-semibold text-gray-900 mb-2 flex items-center justify-center">
              Career0Path
              <img src={bluecap} alt="CareerPath" className="w-8 h-8 ml-2" />
            </h2>
            <p className="text-gray-600">
              {isLogin ? 'Welcome back' : 'Create an Account'}
            </p>
          </div>
          {message && (
            <div className={`mb-4 p-3 rounded-2xl text-sm ${
              message.includes('error') || message.includes('Error') 
                ? 'bg-red-50 text-red-600 border border-red-200' 
                : 'bg-green-50 text-green-600 border border-green-200'
            }`}>
              {message}
            </div>
          )}
          <form onSubmit={handleEmailAuth} className="space-y-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full px-4 py-4 pr-12 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full px-12 py-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white text-lg font-medium rounded-[60px] shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </span>
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Sign Up'}
                  <span className="ml-3">→</span>
                </>
              )}
            </motion.button>
          </form>
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gradient-to-br from-gray-50 to-blue-50 text-gray-500">or</span>
            </div>
          </div>
          <motion.button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full px-12 py-4 bg-white border-2 border-gray-200 text-gray-700 text-lg font-medium rounded-[60px] shadow-lg hover:shadow-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mb-6 flex items-center justify-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
            ) : (
              <>
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
                <span className="ml-3">→</span>
              </>
            )}
          </motion.button>
          <div className="text-center mt-6">
            <p className="text-gray-600">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setMessage('');
                  setFormData({ email: '', password: '' });
                }}
                className="text-blue-600 hover:text-blue-700 font-medium ml-1 hover:underline"
              >
                {isLogin ? 'Sign Up' : 'Login'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}