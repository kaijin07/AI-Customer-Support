import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
import BrandLogo from './BrandLogo.jsx';
import gsap from 'gsap';
import { useAuth } from '../hooks/useAuth.js';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navRef = useRef(null);
  const mobilePanelRef = useRef(null);
  const prevScrollRef = useRef(0);

  useEffect(() => {
    prevScrollRef.current = window.scrollY;
    const onScroll = () => {
      const latest = window.scrollY;
      const previous = prevScrollRef.current;
      prevScrollRef.current = latest;

      if (latest > 100 && latest > previous) {
        setHidden(true);
        setMobileMenuOpen(false);
      } else {
        setHidden(false);
      }
      setIsScrolled(latest > 20);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return undefined;

    gsap.to(nav, {
      yPercent: hidden ? -100 : 0,
      duration: 0.35,
      ease: 'power2.inOut',
      overwrite: true,
    });
  }, [hidden]);

  useEffect(() => {
    const panel = mobilePanelRef.current;
    if (!panel) return undefined;

    if (mobileMenuOpen) {
      gsap.fromTo(
        panel,
        { height: 0, opacity: 0 },
        { height: 'auto', opacity: 1, duration: 0.25, ease: 'power2.out' }
      );
    } else {
      gsap.to(panel, { height: 0, opacity: 0, duration: 0.2, ease: 'power2.in' });
    }
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const scrollTop = () => {
    window.scrollTo(0, 0);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about', onClick: scrollTop },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 border-b ${
        isScrolled
          ? 'bg-surface/80 backdrop-blur-lg border-border py-3 shadow-lg'
          : 'bg-transparent border-transparent py-6'
      }`}
      style={{ willChange: 'transform' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[3.25rem] sm:min-h-14 items-center justify-between gap-4">
          <Link
            to="/"
            className="inline-flex items-center shrink-0 rounded-lg py-1 pr-2 -my-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg group"
            aria-label="Hermes AI home"
          >
            <BrandLogo variant="nav" className="group-hover:opacity-90 transition-opacity duration-300" />
          </Link>

          <div className="hidden md:flex items-center space-x-1 bg-surface/50 backdrop-blur-md px-2 py-1.5 rounded-full border border-border/50">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={link.onClick}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  location.pathname === link.path
                    ? 'text-white bg-primary/20'
                    : 'text-muted hover:text-white hover:bg-surface'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 text-sm font-medium text-muted hover:text-white transition-colors"
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn-secondary py-2 px-5 text-sm flex items-center gap-2 rounded-full"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-muted hover:text-white transition-colors px-3 py-2"
                >
                  Login
                </Link>
                <Link to="/signup" className="btn-primary py-2 px-6 text-sm rounded-full">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-muted hover:text-white transition-colors"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <div
        ref={mobilePanelRef}
        className="md:hidden bg-surface border-b border-border overflow-hidden"
        style={{ height: 0, opacity: 0 }}
      >
        <div className="px-4 pt-2 pb-6 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="block px-3 py-3 rounded-md text-base font-medium text-muted hover:text-white hover:bg-bg"
              onClick={() => {
                link.onClick?.();
                setMobileMenuOpen(false);
              }}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-border mt-4 flex flex-col gap-3">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-3 py-3 text-base font-medium text-muted hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LayoutDashboard size={20} />
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="btn-secondary w-full"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-3 text-base font-medium text-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="btn-primary w-full text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
