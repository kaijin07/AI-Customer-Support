import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { MessageSquareText, Globe, Shield, ArrowRight, Bot, Zap, BarChart3, Clock, LayoutDashboard, ArrowUpRight } from 'lucide-react';
import HorizontalParallax from '../components/HorizontalParallax';
import { useScrollReveal } from '../hooks/useScrollReveal';

const Home = () => {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Reveal hooks
  const bentoReveal = useScrollReveal();
  const howReveal = useScrollReveal();

  return (
    <div className="flex-1 flex flex-col w-full bg-bg overflow-hidden text-text relative">
      
      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-100"
        style={{ scaleX: smoothProgress }}
      />

      {/* Global Background Grid Pattern */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.02]" 
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} 
      />

      {/* 1. HERO SECTION */}
      <section className="relative w-full pt-40 pb-20 px-4 overflow-hidden z-10 flex flex-col items-center">
        {/* Subtle top glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[30vh] bg-primary/20 blur-[150px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto text-center flex flex-col items-center relative z-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border/50 text-muted text-xs font-medium mb-8 backdrop-blur-md"
          >
            <Zap size={14} className="text-accent fill-current" />
            <span>Hermes AI 2.0 is now live</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight"
          >
            Customer support on <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-accent">absolute autopilot.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg md:text-xl text-muted mb-10 max-w-2xl font-light leading-relaxed"
          >
            Resolve 80% of inquiries instantly. Train your agent in seconds. Scale your business globally without adding headcount.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
          >
            <Link to="/signup" className="w-full sm:w-auto px-6 py-3 bg-primary hover:bg-primary-hover text-white font-medium rounded-full flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]">
              Start Free Trial
              <ArrowRight size={18} />
            </Link>
            <Link to="/about" className="w-full sm:w-auto px-6 py-3 bg-surface hover:bg-surface/80 border border-border text-white font-medium rounded-full flex items-center justify-center gap-2 transition-all duration-300">
              Documentation
            </Link>
          </motion.div>
        </div>

        {/* Dashboard Preview */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="w-full max-w-4xl mx-auto mt-20 relative z-20 group"
        >
          <div className="absolute -inset-0.5 bg-linear-to-b from-border to-transparent rounded-xl blur-[2px] opacity-50" />
          <div className="relative aspect-video w-full bg-surface border border-border rounded-xl overflow-hidden shadow-2xl flex flex-col">
            <div className="w-full h-10 border-b border-border flex items-center px-4 gap-2 bg-bg/50">
              <div className="w-2.5 h-2.5 rounded-full bg-border" />
              <div className="w-2.5 h-2.5 rounded-full bg-border" />
              <div className="w-2.5 h-2.5 rounded-full bg-border" />
            </div>
            <div className="flex-1 flex flex-col items-center justify-center text-muted/50">
              <LayoutDashboard size={40} className="mb-3" />
              <p className="text-xs tracking-widest uppercase">Platform Interface</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 2. BENTO GRID */}
      <section className="relative w-full py-32 px-4 z-10 bg-bg border-t border-border/30">
        <div className="max-w-5xl mx-auto" ref={bentoReveal.ref}>
          <div className="mb-12 text-center md:text-left">
            <h2 className="text-3xl font-bold mb-3 tracking-tight">Precision Engineered</h2>
            <p className="text-muted text-lg max-w-xl mx-auto md:mx-0">Metrics that actually move the needle for your business.</p>
          </div>

          <motion.div 
            initial="hidden"
            animate={bentoReveal.isInView ? "visible" : "hidden"}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <motion.div variants={bentoReveal.variants} className="md:col-span-2 p-8 rounded-2xl bg-surface border border-border hover:border-primary/50 transition-colors flex flex-col justify-between group h-[280px]">
              <div className="flex justify-between items-start">
                <div className="p-2.5 bg-primary/10 text-primary rounded-lg"><BarChart3 size={20} /></div>
                <ArrowUpRight size={20} className="text-muted group-hover:text-primary transition-colors" />
              </div>
              <div>
                <h3 className="text-5xl font-bold tracking-tight text-white mb-2">99.9%</h3>
                <p className="text-muted font-light">Resolution rate on trained knowledge base queries.</p>
              </div>
            </motion.div>

            <motion.div variants={bentoReveal.variants} className="md:col-span-1 p-8 rounded-2xl bg-surface border border-border hover:border-accent/50 transition-colors flex flex-col justify-between h-[280px]">
              <div className="p-2.5 bg-accent/10 text-accent rounded-lg w-fit"><Clock size={20} /></div>
              <div>
                <h3 className="text-4xl font-bold tracking-tight text-white mb-2">&lt;1s</h3>
                <p className="text-sm text-muted font-light">Average response latency.</p>
              </div>
            </motion.div>

            <motion.div variants={bentoReveal.variants} className="md:col-span-1 p-8 rounded-2xl bg-surface border border-border hover:border-success/50 transition-colors flex flex-col justify-between h-[280px]">
              <div className="p-2.5 bg-success/10 text-success rounded-lg w-fit"><Globe size={20} /></div>
              <div>
                <h3 className="text-4xl font-bold tracking-tight text-white mb-2">50+</h3>
                <p className="text-sm text-muted font-light">Languages translated natively.</p>
              </div>
            </motion.div>

            <motion.div variants={bentoReveal.variants} className="md:col-span-2 p-8 rounded-2xl bg-surface border border-border hover:border-primary/50 transition-colors flex flex-col justify-between overflow-hidden relative h-[280px]">
              <div className="absolute right-[-10%] bottom-[-20%] text-primary/5">
                <Shield size={240} />
              </div>
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="p-2.5 bg-bg border border-border text-white rounded-lg w-fit"><Shield size={20} /></div>
                <div>
                  <h3 className="text-2xl font-bold tracking-tight text-white mb-2">Enterprise Security</h3>
                  <p className="text-muted font-light text-sm max-w-sm">SOC2 Type II compliant. Your data is isolated, encrypted, and never used to train public models.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 3. HORIZONTAL SCROLL STORYTELLING */}
      <HorizontalParallax>
        <div className="w-[85vw] md:w-[600px] shrink-0 h-[400px] bg-surface border border-border rounded-2xl p-8 md:p-12 flex flex-col justify-center relative overflow-hidden group hover:border-primary/40 transition-colors duration-500 shadow-xl">
          <div className="absolute -right-20 -top-20 w-48 h-48 bg-primary/10 blur-[60px] rounded-full group-hover:bg-primary/20 transition-colors duration-700" />
          <MessageSquareText size={40} className="text-primary mb-6" />
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">Context-Aware AI</h3>
          <p className="text-muted font-light leading-relaxed">Hermes ingests your entire knowledge base instantly, providing perfectly accurate answers without hallucinations. It understands context, tone, and brand guidelines automatically.</p>
        </div>

        <div className="w-[85vw] md:w-[600px] shrink-0 h-[400px] bg-surface border border-border rounded-2xl p-8 md:p-12 flex flex-col justify-center relative overflow-hidden group hover:border-accent/40 transition-colors duration-500 shadow-xl">
          <div className="absolute -left-20 -bottom-20 w-48 h-48 bg-accent/10 blur-[60px] rounded-full group-hover:bg-accent/20 transition-colors duration-700" />
          <Bot size={40} className="text-accent mb-6" />
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">Seamless Escalation</h3>
          <p className="text-muted font-light leading-relaxed">When a query requires a human touch, Hermes smoothly transfers the conversation to your team alongside a full summary of the issue. No customer ever hits a dead end.</p>
        </div>

        <div className="w-[85vw] md:w-[600px] shrink-0 h-[400px] bg-surface border border-border rounded-2xl p-8 md:p-12 flex flex-col justify-center relative overflow-hidden group hover:border-success/40 transition-colors duration-500 shadow-xl">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-success/10 blur-[60px] rounded-full group-hover:bg-success/20 transition-colors duration-700" />
          <LayoutDashboard size={40} className="text-success mb-6" />
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">Deep Analytics</h3>
          <p className="text-muted font-light leading-relaxed">Gain unprecedented insights into what your customers are asking. Identify documentation gaps and product pain points automatically from chat data.</p>
        </div>
      </HorizontalParallax>

      {/* 4. REFINED CTA & FOOTER */}
      <section className="w-full bg-bg pt-32 pb-16 px-4 border-t border-border/30 z-10">
        <div className="max-w-4xl mx-auto mb-24">
          <div className="bg-surface/50 border border-border rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
            
            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight relative z-10">Ready to automate?</h2>
            <p className="text-muted mb-8 max-w-lg mx-auto relative z-10">Join the next generation of customer support. Deploy Hermes AI today and experience zero latency resolutions.</p>
            
            <Link to="/signup" className="relative z-10 inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-full hover:scale-105 transition-transform">
              Start your free trial
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Structured Professional Footer */}
        <footer className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 lg:col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <Zap size={18} className="text-primary fill-current" />
                <span className="font-bold tracking-tight text-white">Hermes AI</span>
              </Link>
              <p className="text-sm text-muted max-w-xs">Intelligent customer support automation for modern, forward-thinking teams.</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-3 text-sm">Product</h4>
              <ul className="space-y-2 text-sm text-muted">
                <li><Link to="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link to="/changelog" className="hover:text-white transition-colors">Changelog</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-3 text-sm">Resources</h4>
              <ul className="space-y-2 text-sm text-muted">
                <li><Link to="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link to="/api" className="hover:text-white transition-colors">API Reference</Link></li>
                <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-3 text-sm">Company</h4>
              <ul className="space-y-2 text-sm text-muted">
                <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted">
            <p>© {new Date().getFullYear()} Hermes AI, Inc. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
              <a href="#" className="hover:text-white transition-colors">GitHub</a>
              <a href="#" className="hover:text-white transition-colors">Discord</a>
            </div>
          </div>
        </footer>
      </section>

    </div>
  );
};

export default Home;
