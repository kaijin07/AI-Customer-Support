import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, Loader2, Zap } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  
  // Google Registration Flow
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleCredential, setGoogleCredential] = useState(null);
  const [googleBusinessName, setGoogleBusinessName] = useState('');

  const { user, login, googleLogin, loading, error, reset } = useAuth();
  const navigate = useNavigate();

  const { email, password } = formData;

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
    if (!email || !password) return;
    login({ email, password });
  };

  const onGoogleSuccess = async (response) => {
    // For Login, we first try to login normally.
    // If the backend determines this is a NEW user, it will now be configured 
    // to return a specific error if businessName is missing.
    setGoogleCredential(response.credential);
    
    try {
      const result = await googleLogin(response.credential);
      // If result is success, useEffect will handle navigation
    } catch (err) {
      // We'll handle the "Business Name Required" case here
      if (err.includes('BUSINESS_NAME_REQUIRED')) {
        setShowGoogleModal(true);
      }
    }
  };

  const handleGoogleSubmit = (e) => {
    e.preventDefault();
    if (!googleBusinessName.trim()) return;
    setShowGoogleModal(false);
    googleLogin(googleCredential, googleBusinessName);
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-bg pt-24">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary opacity-5 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent opacity-5 blur-[100px] rounded-full"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="card glass p-8 md:p-10 shadow-2xl relative overflow-hidden">
          <div className="flex justify-center mb-8">
            <div className="p-3 bg-primary rounded-xl shadow-lg shadow-primary/20">
              <Zap size={32} className="text-white fill-current" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center text-white mb-2">Welcome Back</h2>
          <p className="text-center text-muted text-sm mb-8">Login to manage your AI customer support.</p>
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6 p-3 text-xs font-medium text-center text-red-400 bg-red-400/10 border border-red-400/20 rounded-md"
            >
              {error.toString()}
            </motion.div>
          )}
          
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted uppercase tracking-wider ml-1" htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                className="input-field py-3"
                value={email}
                onChange={onChange}
                required
                placeholder="name@company.com"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-semibold text-muted uppercase tracking-wider" htmlFor="password">Password</label>
                <Link to="#" className="text-xs text-primary hover:underline">Forgot?</Link>
              </div>
              <input
                type="password"
                id="password"
                name="password"
                className="input-field py-3"
                value={password}
                onChange={onChange}
                required
                placeholder="••••••••"
              />
            </div>
            
            <button 
              type="submit" 
              className="btn-primary w-full py-3 mt-4 flex justify-center items-center gap-2" 
              disabled={loading}
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : (
                <>
                  <LogIn size={20} />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="my-8 flex items-center before:flex-1 before:border-t before:border-border after:flex-1 after:border-t after:border-border">
            <span className="mx-4 text-[10px] text-muted font-bold uppercase tracking-widest">Or continue with</span>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={onGoogleSuccess}
              onError={() => console.error('Google Login Failed')}
              theme="filled_black"
              shape="pill"
              width="100%"
            />
          </div>
          
          <div className="mt-8 text-center text-sm">
            <span className="text-muted">Don't have an account? </span>
            <Link to="/signup" className="text-primary font-bold hover:underline transition-all">
              Create an account
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Google Business Name Modal (For New Users) */}
      <AnimatePresence>
        {showGoogleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowGoogleModal(false)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.95, opacity: 0, y: 20 }} 
              className="relative w-full max-w-md bg-surface border border-border p-8 rounded-2xl shadow-2xl z-10"
            >
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary mb-6">
                <Zap size={24} />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2">Welcome to Hermes</h3>
              <p className="text-muted text-sm mb-6">
                It looks like this is your first time here! What's the name of your business?
              </p>
              
              <form onSubmit={handleGoogleSubmit} className="space-y-4">
                <input
                  type="text"
                  value={googleBusinessName}
                  onChange={(e) => setGoogleBusinessName(e.target.value)}
                  placeholder="e.g. Acme Corporation"
                  className="input-field py-3"
                  autoFocus
                  required
                />
                <button 
                  type="submit" 
                  className="btn-primary w-full py-3 flex justify-center items-center gap-2"
                  disabled={loading}
                >
                  {loading ? <Loader2 size={20} className="animate-spin" /> : 'Complete Registration'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;
