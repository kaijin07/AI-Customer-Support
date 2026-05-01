import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance.js';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    businessName: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { name, email, password, businessName } = formData;

  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Client-side validation
    if (!name || !email || !password || !businessName) {
      return setError('All fields are required');
    }

    if (!isValidEmail(email)) {
      return setError('Please enter a valid email address');
    }

    if (password.length < 6) {
      return setError('Password must be at least 6 characters long');
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/signup', {
        name,
        email,
        password,
        businessName,
      });

      if (response.data.success) {
        setSuccess('Account created successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-semibold text-center mb-6">Create Account</h2>
        {error && <div className="mb-4 p-2 text-sm text-center text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400 rounded">{error}</div>}
        {success && <div className="mb-4 p-2 text-sm text-center text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 rounded">{success}</div>}
        
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
              placeholder="Enter your business name"
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full py-3 px-4 bg-primary hover:bg-primary-hover text-white font-medium rounded-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center" 
            disabled={loading}
          >
            {loading ? (
               <span className="flex items-center gap-2">
                 <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
                 Creating...
               </span>
             ) : 'Sign Up'}
          </button>
        </form>
        
        <Link to="/login" className="block text-center mt-4 text-sm text-primary hover:underline dark:text-blue-400">
          Already have an account? Login
        </Link>
      </div>
    </div>
  );
};

export default Signup;
