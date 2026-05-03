import React, { useRef, useLayoutEffect, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  MessageSquareText,
  Globe,
  Shield,
  ArrowRight,
  Bot,
  BarChart3,
  Clock,
  LayoutDashboard,
  ArrowUpRight,
  BookOpen,
  Code2,
  Ticket as TicketIcon,
  Settings,
  HelpCircle,
  Code,
} from 'lucide-react';
import HorizontalParallax from '../components/HorizontalParallax';
import HomeHero from '../components/HomeHero';
import BrandLogo from '../components/BrandLogo.jsx';
import { useScrollReveal } from '../hooks/useScrollReveal';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const progressRef = useRef(null);
  const dashboardMockRef = useRef(null);
  const bentoGridRef = useRef(null);
  const bentoAnimatedRef = useRef(false);

  const bentoReveal = useScrollReveal();

  useLayoutEffect(() => {
    const el = progressRef.current;
    if (!el) return undefined;

    gsap.set(el, { transformOrigin: 'left center', scaleX: 0 });

    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      scrub: 0.35,
      onUpdate: (self) => {
        gsap.set(el, { scaleX: self.progress });
      },
    });

    return () => {
      st.kill();
    };
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.home-hero-dashboard-mock', {
        opacity: 0,
        y: 44,
        duration: 0.85,
        delay: 0.45,
        ease: 'power3.out',
      });
    }, dashboardMockRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!bentoReveal.isInView || bentoAnimatedRef.current) return;
    const grid = bentoGridRef.current;
    if (!grid?.children?.length) return;
    bentoAnimatedRef.current = true;
    gsap.from(grid.children, {
      opacity: 0,
      y: 50,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
    });
  }, [bentoReveal.isInView]);

  return (
    <div className="flex-1 flex flex-col w-full bg-bg overflow-x-hidden text-text relative">
      <div
        ref={progressRef}
        className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-100 pointer-events-none"
      />

      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.02]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      <div ref={dashboardMockRef} className="flex flex-col items-center w-full">
        <HomeHero />

        <div className="home-hero-dashboard-mock home-hero-preview w-full max-w-6xl mx-auto mt-10 sm:mt-12 lg:mt-14 px-3 sm:px-4 pb-12 sm:pb-16 lg:pb-20 relative z-20 group">
          <p className="text-center text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-muted mb-3 sm:mb-4">
            Same dashboard inside the app — Tickets view
          </p>
          <div className="absolute -inset-px rounded-2xl bg-linear-to-b from-primary/25 via-transparent to-accent/15 opacity-40 blur-xl pointer-events-none" />

          {/* Mirrors pages/Dashboard.jsx + Sidebar + TicketsTab empty state */}
          <div className="relative rounded-2xl border border-border/90 bg-bg overflow-hidden shadow-[0_24px_64px_-12px_rgba(0,0,0,0.55)] ring-1 ring-white/[0.06]">
            <div className="flex flex-col md:flex-row w-full min-h-[260px] sm:min-h-[320px]">
              <aside className="w-full md:w-56 lg:w-64 shrink-0 border-b md:border-b-0 md:border-r border-border p-3 sm:p-4 space-y-1.5 sm:space-y-2 md:space-y-2 bg-bg">
                <div className="mb-4 sm:mb-6 md:mb-8 px-2 md:px-4 pt-1">
                  <p className="text-[11px] sm:text-xs font-semibold text-muted uppercase tracking-wider">Main Menu</p>
                </div>
                {[
                  { id: 'overview', name: 'Overview', Icon: Bot, active: false },
                  { id: 'config', name: 'Bot Config', Icon: Settings, active: false },
                  { id: 'tickets', name: 'Tickets', Icon: TicketIcon, active: true },
                  { id: 'embed', name: 'Embed Widget', Icon: Code, active: false },
                ].map(({ name, Icon, active }) => (
                  <div
                    key={name}
                    className={`flex w-full items-center gap-3 px-3 sm:px-4 py-2.5 rounded-md text-sm font-medium cursor-default ${active ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted'}`}
                  >
                    <Icon size={18} className={active ? 'shrink-0 opacity-95' : 'shrink-0 opacity-85'} aria-hidden />
                    <span>{name}</span>
                  </div>
                ))}
              </aside>

              <div className="flex-1 min-w-0 flex flex-col p-4 sm:p-6 md:p-8 lg:p-10 overflow-auto">
                <header className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-8 sm:mb-10">
                  <div className="min-w-0">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Dashboard</h1>
                    <p className="text-muted text-sm sm:text-base mt-1">
                      Manage your AI agent and support tickets.
                    </p>
                  </div>
                  <span className="inline-flex shrink-0 self-start px-4 py-1.5 bg-surface border border-border rounded-full text-sm font-medium text-accent shadow-sm max-w-[14rem] truncate">
                    Preview account
                  </span>
                </header>

                <div className="rounded-lg bg-surface border border-border transition-all min-h-[300px] sm:min-h-[360px] p-5 md:p-6">
                  <div className="flex items-center gap-3 border-b border-border pb-4 md:pb-6 mb-4 md:mb-6">
                    <TicketIcon className="text-primary shrink-0" size={22} aria-hidden />
                    <h3 className="text-lg sm:text-xl font-bold text-white">Escalated Support Tickets (0)</h3>
                  </div>
                  <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-muted text-center px-2">
                    <HelpCircle size={48} strokeWidth={1.25} className="mb-4 opacity-20 text-muted" aria-hidden />
                    <p className="text-sm sm:text-base max-w-sm leading-relaxed">
                      No support tickets yet. Your bot is doing a great job!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="relative w-full py-32 px-4 z-10 bg-bg border-t border-border/30">
        <div className="max-w-5xl mx-auto" ref={bentoReveal.ref}>
          <div className="mb-12 text-center md:text-left">
            <h2 className="text-3xl font-bold mb-3 tracking-tight">Precision Engineered</h2>
            <p className="text-muted text-lg max-w-xl mx-auto md:mx-0">
              Metrics that actually move the needle for your business.
            </p>
          </div>

          <div ref={bentoGridRef} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 p-8 rounded-2xl bg-surface border border-border hover:border-primary/50 transition-colors flex flex-col justify-between group h-[280px]">
              <div className="flex justify-between items-start">
                <div className="p-2.5 bg-primary/10 text-primary rounded-lg">
                  <BarChart3 size={20} />
                </div>
                <ArrowUpRight size={20} className="text-muted group-hover:text-primary transition-colors" />
              </div>
              <div>
                <h3 className="text-5xl font-bold tracking-tight text-white mb-2">99.9%</h3>
                <p className="text-muted font-light">Resolution rate on trained knowledge base queries.</p>
              </div>
            </div>

            <div className="md:col-span-1 p-8 rounded-2xl bg-surface border border-border hover:border-accent/50 transition-colors flex flex-col justify-between h-[280px]">
              <div className="p-2.5 bg-accent/10 text-accent rounded-lg w-fit">
                <Clock size={20} />
              </div>
              <div>
                <h3 className="text-4xl font-bold tracking-tight text-white mb-2">&lt;1s</h3>
                <p className="text-sm text-muted font-light">Average response latency.</p>
              </div>
            </div>

            <div className="md:col-span-1 p-8 rounded-2xl bg-surface border border-border hover:border-success/50 transition-colors flex flex-col justify-between h-[280px]">
              <div className="p-2.5 bg-success/10 text-success rounded-lg w-fit">
                <Globe size={20} />
              </div>
              <div>
                <h3 className="text-4xl font-bold tracking-tight text-white mb-2">50+</h3>
                <p className="text-sm text-muted font-light">Languages translated natively.</p>
              </div>
            </div>

            <div className="md:col-span-2 p-8 rounded-2xl bg-surface border border-border hover:border-primary/50 transition-colors flex flex-col justify-between overflow-hidden relative h-[280px]">
              <div className="absolute right-[-10%] bottom-[-20%] text-primary/5">
                <Shield size={240} />
              </div>
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="p-2.5 bg-bg border border-border text-white rounded-lg w-fit">
                  <Shield size={20} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold tracking-tight text-white mb-2">Enterprise Security</h3>
                  <p className="text-muted font-light text-sm max-w-sm">
                    SOC2 Type II compliant. Your data is isolated, encrypted, and never used to train public models.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <HorizontalParallax
        title="Hermes product tour"
        storyKicker="Hermes · product tour"
        headlineTop="AI-first support."
        headlineAccent="Zero busywork."
        subtitle="One embeddable widget, one dashboard: Hermes answers from your FAQs and docs, opens escalated tickets when humans need to step in, and keeps every conversation on-brand."
        scrollHint="Scroll · explore"
        ctaEyebrow="Ship faster"
        ctaHeadline="Resolve more tickets without hiring another shift."
      >
        <div className="w-full min-h-[380px] md:h-[400px] bg-surface border border-border rounded-2xl p-8 md:p-12 flex flex-col justify-center relative overflow-hidden group hover:border-primary/40 transition-colors duration-500 shadow-xl">
          <div className="absolute -right-20 -top-20 w-48 h-48 bg-primary/10 blur-[60px] rounded-full group-hover:bg-primary/20 transition-colors duration-700" />
          <MessageSquareText size={40} className="text-primary mb-6" />
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">Your site, your voice</h3>
          <p className="text-muted font-light leading-relaxed">
            Drop the Hermes chat widget on marketing pages or inside your app. Visitors get instant replies that follow
            the tone and guardrails you set—no generic bot monologue.
          </p>
        </div>

        <div className="w-full min-h-[380px] md:h-[400px] bg-surface border border-border rounded-2xl p-8 md:p-12 flex flex-col justify-center relative overflow-hidden group hover:border-accent/40 transition-colors duration-500 shadow-xl">
          <div className="absolute -left-16 bottom-0 w-44 h-44 bg-accent/10 blur-[56px] rounded-full group-hover:bg-accent/20 transition-colors duration-700" />
          <BookOpen size={40} className="text-accent mb-6" />
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">Answers grounded in your docs</h3>
          <p className="text-muted font-light leading-relaxed">
            Upload FAQs and policies in the dashboard. Hermes uses retrieval-augmented generation so replies lean on
            your sources—not vibes—before it ever tells a customer “check our website.”
          </p>
        </div>

        <div className="w-full min-h-[380px] md:h-[400px] bg-surface border border-border rounded-2xl p-8 md:p-12 flex flex-col justify-center relative overflow-hidden group hover:border-success/40 transition-colors duration-500 shadow-xl">
          <div className="absolute -left-20 -bottom-20 w-48 h-48 bg-success/10 blur-[60px] rounded-full group-hover:bg-success/20 transition-colors duration-700" />
          <TicketIcon size={40} className="text-success mb-6" />
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">Escalations that land in Tickets</h3>
          <p className="text-muted font-light leading-relaxed">
            When a thread needs a human, Hermes opens an escalated ticket with the full visitor message and context—so
            your team picks up inside the same dashboard instead of re-reading email chains.
          </p>
        </div>

        <div className="w-full min-h-[380px] md:h-[400px] bg-surface border border-border rounded-2xl p-8 md:p-12 flex flex-col justify-center relative overflow-hidden group hover:border-primary/40 transition-colors duration-500 shadow-xl">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/10 blur-[60px] rounded-full group-hover:bg-primary/20 transition-colors duration-700" />
          <LayoutDashboard size={40} className="text-primary mb-6" />
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">One dashboard, full control</h3>
          <p className="text-muted font-light leading-relaxed">
            Overview, bot config, escalated tickets, and embed settings live together—preview the bot, watch active
            tickets, and tune copy without jumping between tools.
          </p>
        </div>

        <div className="w-full min-h-[380px] md:h-[400px] bg-surface border border-border rounded-2xl p-8 md:p-12 flex flex-col justify-center relative overflow-hidden group hover:border-accent/40 transition-colors duration-500 shadow-xl">
          <div className="absolute -right-12 top-8 w-40 h-40 bg-accent/10 blur-[50px] rounded-full group-hover:bg-accent/20 transition-colors duration-700" />
          <Settings size={40} className="text-accent mb-6" />
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">Bot config in clicks, not code</h3>
          <p className="text-muted font-light leading-relaxed">
            Shape personality, FAQs, and escalation rules from Bot Config. Push updates whenever messaging or policies
            change—no redeploy required to refresh what Hermes is allowed to say.
          </p>
        </div>

        <div className="w-full min-h-[380px] md:h-[400px] bg-surface border border-border rounded-2xl p-8 md:p-12 flex flex-col justify-center relative overflow-hidden group hover:border-primary/40 transition-colors duration-500 shadow-xl">
          <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-48 h-48 bg-primary/10 blur-[60px] rounded-full group-hover:bg-primary/20 transition-colors duration-700" />
          <Code2 size={40} className="text-primary mb-6" />
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">Embed once, reuse everywhere</h3>
          <p className="text-muted font-light leading-relaxed">
            Copy the snippet from Embed Widget, paste it on any surface that loads JavaScript, and you’re live with the
            same Hermes instance your team already configured—no duplicate bots per property.
          </p>
        </div>

        <div className="w-full min-h-[380px] md:h-[400px] bg-surface border border-border rounded-2xl p-8 md:p-12 flex flex-col justify-center relative overflow-hidden group hover:border-success/40 transition-colors duration-500 shadow-xl">
          <div className="absolute right-[-10%] bottom-[-15%] text-success/10 pointer-events-none">
            <Shield size={180} />
          </div>
          <div className="relative z-10">
            <Shield size={40} className="text-success mb-6" />
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">Built for real support traffic</h3>
            <p className="text-muted font-light leading-relaxed">
              Tenant-scoped data, hardened defaults, and a workflow designed around sensitive customer messages—so
              Hermes fits how you already think about trust and compliance.
            </p>
          </div>
        </div>
      </HorizontalParallax>

      <section className="relative z-10 w-full bg-bg pt-32 pb-16 px-4 border-t border-border/30">
        <div className="max-w-4xl mx-auto mb-24">
          <div className="bg-surface/50 border border-border rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
                backgroundSize: '30px 30px',
              }}
            />
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />

            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight relative z-10">Ready to automate?</h2>
            <p className="text-muted mb-8 max-w-lg mx-auto relative z-10">
              Join the next generation of customer support. Deploy Hermes AI today and experience zero latency resolutions.
            </p>

            <Link
              to="/signup"
              className="relative z-10 inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-full hover:scale-105 transition-transform"
            >
              Start your free trial
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <footer className="max-w-6xl mx-auto px-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mb-12">
            <div>
              <Link to="/" className="inline-flex mb-4" aria-label="Hermes AI home">
                <BrandLogo variant="footer" />
              </Link>
              <p className="text-sm text-muted max-w-sm leading-relaxed">
                AI-powered customer support for your site—train from your docs, embed one widget, and manage escalations
                from a single dashboard.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-3 text-sm">Company</h4>
              <ul className="space-y-2 text-sm text-muted">
                <li>
                  <Link
                    to="/about"
                    className="hover:text-white transition-colors"
                    onClick={() => window.scrollTo(0, 0)}
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/signup" className="hover:text-white transition-colors">
                    Get started
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-border/50 text-xs text-muted text-center sm:text-left">
            <p>© {new Date().getFullYear()} Hermes AI. All rights reserved.</p>
          </div>
        </footer>
      </section>
    </div>
  );
};

export default Home;
