import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import gsap from 'gsap';
import { LogIn, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import BrandLogo from '../components/BrandLogo.jsx';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleCredential, setGoogleCredential] = useState(null);
  const [googleBusinessName, setGoogleBusinessName] = useState('');

  const { user, login, googleLogin, loading, error, reset } = useAuth();
  const navigate = useNavigate();

  const cardRef = useRef(null);
  const errorBannerRef = useRef(null);
  const modalBackdropRef = useRef(null);
  const modalPanelRef = useRef(null);

  const { email, password } = formData;

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    return () => reset();
  }, [reset]);

  useLayoutEffect(() => {
    const el = cardRef.current;
    if (!el) return undefined;
    const ctx = gsap.context(() => {
      gsap.from(el, { opacity: 0, scale: 0.95, duration: 0.45, ease: 'power3.out' });
    }, el);
    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    const banner = errorBannerRef.current;
    if (!banner || !error) return undefined;
    const ctx = gsap.context(() => {
      gsap.from(banner, { opacity: 0, x: -10, duration: 0.25, ease: 'power3.out' });
    }, banner);
    return () => ctx.revert();
  }, [error]);

  useLayoutEffect(() => {
    if (!showGoogleModal) return undefined;
    const backdrop = modalBackdropRef.current;
    const panel = modalPanelRef.current;
    const ctx = gsap.context(() => {
      if (backdrop) gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.25 });
      if (panel) {
        gsap.fromTo(
          panel,
          { scale: 0.95, opacity: 0, y: 20 },
          { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: 'power3.out', delay: 0.05 }
        );
      }
    });
    return () => ctx.revert();
  }, [showGoogleModal]);

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
    setGoogleCredential(response.credential);

    try {
      await googleLogin(response.credential);
    } catch (err) {
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

      <div ref={cardRef} className="w-full max-w-md">
        <div className="card glass p-8 md:p-10 shadow-2xl relative overflow-hidden">
          <div className="flex justify-center mb-8">
            <BrandLogo variant="auth" />
          </div>

          <h2 className="text-2xl font-bold text-center text-white mb-2">Welcome Back</h2>
          <p className="text-center text-muted text-sm mb-8">Login to manage your AI customer support.</p>

          {error && (
            <div
              ref={errorBannerRef}
              className="mb-6 p-3 text-xs font-medium text-center text-red-400 bg-red-400/10 border border-red-400/20 rounded-md"
            >
              {error.toString()}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted uppercase tracking-wider ml-1" htmlFor="email">
                Email Address
              </label>
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
                <label className="text-xs font-semibold text-muted uppercase tracking-wider" htmlFor="password">
                  Password
                </label>
                <Link to="#" className="text-xs text-primary hover:underline">
                  Forgot?
                </Link>
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
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
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
            <span className="text-muted">Don&apos;t have an account? </span>
            <Link to="/signup" className="text-primary font-bold hover:underline transition-all">
              Create an account
            </Link>
          </div>
        </div>
      </div>

      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            ref={modalBackdropRef}
            role="presentation"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowGoogleModal(false)}
            onKeyDown={(e) => e.key === 'Escape' && setShowGoogleModal(false)}
          />
          <div
            ref={modalPanelRef}
            className="relative w-full max-w-md bg-surface border border-border p-8 rounded-2xl shadow-2xl z-10"
          >
            <div className="mb-6 flex justify-start">
              <BrandLogo variant="compact" className="max-h-10" />
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">Welcome to Hermes</h3>
            <p className="text-muted text-sm mb-6">
              It looks like this is your first time here! What&apos;s the name of your business?
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
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
