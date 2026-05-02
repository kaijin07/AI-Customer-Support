import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../hooks/useAuth.js';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    businessName: '',
  });
  const { user, signup, googleLogin, loading, error, reset } = useAuth();
  const navigate = useNavigate();

  const { name, email, password, businessName } = formData;

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    return () => reset();
  }, [reset]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    signup(formData);
  };

  const onGoogleSuccess = (response) => {
    if (!businessName.trim()) {
      alert('Please enter your Business Name first to personalize your account!');
      return;
    }
    googleLogin(response.credential, businessName);
  };

  const onGoogleError = () => {
    console.error('Google Signup Failed');
  };

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-semibold text-center mb-6">Create Account</h2>
        {error && <div className="mb-4 p-2 text-sm text-center text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400 rounded">{error.toString()}</div>}
        
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:focus:ring-blue-500"
              value={name}
              onChange={onChange}
              required
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:focus:ring-blue-500"
              value={email}
              onChange={onChange}
              required
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:focus:ring-blue-500"
              value={password}
              onChange={onChange}
              required
              placeholder="Minimum 6 characters"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="businessName">Business Name</label>
            <input
              type="text"
              id="businessName"
              name="businessName"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:focus:ring-blue-500"
              value={businessName}
              onChange={onChange}
              required
              placeholder="Enter your business name"
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full py-3 px-4 bg-primary hover:bg-primary-hover text-white font-medium rounded-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center" 
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Sign Up'}
          </button>
        </form>

        <div className="my-6 flex items-center before:flex-1 before:border-t before:border-gray-300 dark:before:border-gray-600 after:flex-1 after:border-t after:border-gray-300 dark:after:border-gray-600">
          <span className="mx-4 text-xs text-gray-500 uppercase">Or continue with</span>
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={onGoogleSuccess}
            onError={onGoogleError}
            theme="filled_blue"
            text="signup_with"
            shape="rectangular"
          />
        </div>
        
        <Link to="/login" className="block text-center mt-6 text-sm text-primary hover:underline dark:text-blue-400">
          Already have an account? Login
        </Link>
      </div>
    </div>
  );
};

export default Signup;
