import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import gsap from "gsap";
import {
  UserPlus,
  Loader2,
  Briefcase,
  Mail,
  Lock,
  User,
  X,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth.js";
import BrandLogo from "../components/BrandLogo.jsx";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    businessName: "",
  });

  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleCredential, setGoogleCredential] = useState(null);
  const [googleBusinessName, setGoogleBusinessName] = useState("");

  const { user, signup, googleLogin, loading, error, reset } = useAuth();
  const navigate = useNavigate();

  const cardRef = useRef(null);
  const errorBannerRef = useRef(null);
  const modalBackdropRef = useRef(null);
  const modalPanelRef = useRef(null);

  const { name, email, password, businessName } = formData;

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  useEffect(() => {
    return () => reset();
  }, [reset]);

  useLayoutEffect(() => {
    const el = cardRef.current;
    if (!el) return undefined;
    const ctx = gsap.context(() => {
      gsap.from(el, { opacity: 0, y: 20, duration: 0.45, ease: "power3.out" });
    }, el);
    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    const banner = errorBannerRef.current;
    if (!banner || !error) return undefined;
    const ctx = gsap.context(() => {
      gsap.from(banner, {
        opacity: 0,
        scale: 0.95,
        duration: 0.25,
        ease: "power3.out",
      });
    }, banner);
    return () => ctx.revert();
  }, [error]);

  useLayoutEffect(() => {
    if (!showGoogleModal) return undefined;
    const backdrop = modalBackdropRef.current;
    const panel = modalPanelRef.current;
    const ctx = gsap.context(() => {
      if (backdrop)
        gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.25 });
      if (panel) {
        gsap.fromTo(
          panel,
          { scale: 0.95, opacity: 0, y: 20 },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 0.35,
            ease: "power3.out",
            delay: 0.05,
          },
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
    signup(formData);
  };

  const onGoogleSuccess = async (response) => {
    if (businessName.trim()) {
      try {
        await googleLogin(response.credential, businessName);
      } catch (err) {
        if (err.includes("BUSINESS_NAME_REQUIRED")) {
          setGoogleCredential(response.credential);
          setShowGoogleModal(true);
        }
      }
    } else {
      setGoogleCredential(response.credential);
      setShowGoogleModal(true);
    }
  };

  const handleGoogleSubmit = (e) => {
    e.preventDefault();
    if (!googleBusinessName.trim()) return;
    setShowGoogleModal(false);
    googleLogin(googleCredential, googleBusinessName);
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-bg pt-24 pb-12">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-primary opacity-5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-accent opacity-5 blur-[120px] rounded-full"></div>
      </div>

      <div ref={cardRef} className="w-full max-w-lg relative z-10">
        <div className="card glass p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="flex justify-center mb-8">
            <BrandLogo variant="auth" />
          </div>

          <h2 className="text-3xl font-bold text-center text-white mb-2">
            Create Your Account
          </h2>
          <p className="text-center text-muted text-sm mb-10">
            Join 500+ businesses automating their support.
          </p>

          {error && (
            <div
              ref={errorBannerRef}
              className="mb-8 p-4 text-xs font-medium text-center text-red-400 bg-red-400/10 border border-red-400/20 rounded-md"
            >
              {error.toString()}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label
                  className="text-xs font-semibold text-muted uppercase tracking-wider ml-1"
                  htmlFor="name"
                >
                  Full Name
                </label>
                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                  />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="input-field py-3 pl-10"
                    style={{ paddingLeft: "2.5rem" }}
                    value={name}
                    onChange={onChange}
                    required
                    placeholder="Jane Doe"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label
                  className="text-xs font-semibold text-muted uppercase tracking-wider ml-1"
                  htmlFor="businessName"
                >
                  Business Name
                </label>
                <div className="relative">
                  <Briefcase
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                  />
                  <input
                    type="text"
                    id="businessName"
                    name="businessName"
                    className="input-field py-3 pl-10"
                    style={{ paddingLeft: "2.5rem" }}
                    value={businessName}
                    onChange={onChange}
                    required
                    placeholder="Acme Inc."
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label
                className="text-xs font-semibold text-muted uppercase tracking-wider ml-1"
                htmlFor="email"
              >
                Work Email
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                />
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="input-field py-3 pl-10"
                  style={{ paddingLeft: "2.5rem" }}
                  value={email}
                  onChange={onChange}
                  required
                  placeholder="jane@acme.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                className="text-xs font-semibold text-muted uppercase tracking-wider ml-1"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                />
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="input-field py-3 pl-10"
                  style={{ paddingLeft: "2.5rem" }}
                  value={password}
                  onChange={onChange}
                  required
                  placeholder="••••••••"
                />
              </div>
              <p className="text-[10px] text-muted ml-1">
                Must be at least 6 characters.
              </p>
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-4 mt-4 flex justify-center items-center gap-2 text-lg"
              disabled={loading}
            >
              {loading ? (
                <Loader2 size={24} className="animate-spin" />
              ) : (
                <>
                  <UserPlus size={24} />
                  Get Started
                </>
              )}
            </button>
          </form>

          <div className="my-10 flex items-center before:flex-1 before:border-t before:border-border after:flex-1 after:border-t after:border-border">
            <span className="mx-4 text-[10px] text-muted font-bold uppercase tracking-widest text-center">
              Or fast-track with Google
            </span>
          </div>

          <div className="flex justify-center relative z-20">
             {/* <GoogleLogin
              onSuccess={onGoogleSuccess}
              onError={() => console.error("Google Signup Failed")}
              theme="filled_black"
              shape="pill"
              width="100%"
              text="signup_with"
            />  */}
          

          <GoogleLogin
            onSuccess={onGoogleSuccess}
            onError={() => console.error("Google Signup Failed")}
            theme="filled_black"
            shape="pill"
            width={300} // ✅ number, not string
            text="signup_with" // optional, can remove if issues persist
          />

          </div>

          <div className="mt-10 text-center text-sm">
            <span className="text-muted">Already have an account? </span>
            <Link
              to="/login"
              className="text-primary font-bold hover:underline"
            >
              Sign in here
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
          />
          <div
            ref={modalPanelRef}
            className="relative w-full max-w-md bg-surface border border-border p-8 rounded-2xl shadow-2xl z-10"
          >
            <button
              type="button"
              onClick={() => setShowGoogleModal(false)}
              className="absolute top-4 right-4 text-muted hover:text-white transition-colors p-2"
            >
              <X size={20} />
            </button>

            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary mb-6">
              <Briefcase size={24} />
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">
              One last step
            </h3>
            <p className="text-muted text-sm mb-6">
              What&apos;s the name of your business? We&apos;ll use this to
              personalize your AI agent.
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
                {loading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  "Complete Signup"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;
