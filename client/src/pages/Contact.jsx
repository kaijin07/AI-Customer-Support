import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle, ArrowRight } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const headerReveal = useScrollReveal();
  const formReveal = useScrollReveal();

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // UI mock
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <div className="flex-1 w-full bg-bg pt-32 pb-24 overflow-hidden relative">
      
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-primary/5 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-accent/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-20 space-y-6" ref={headerReveal.ref}>
          <motion.h1 
            initial="hidden" animate={headerReveal.isInView ? "visible" : "hidden"} variants={headerReveal.variants}
            className="text-5xl md:text-7xl font-extrabold text-white tracking-tight"
          >
            Let's <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-accent">Connect</span>
          </motion.h1>
          <motion.p 
            initial="hidden" animate={headerReveal.isInView ? "visible" : "hidden"} variants={headerReveal.variants}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted max-w-2xl mx-auto font-light"
          >
            Have questions about integrating Hermes into your platform? Our team is ready to help you scale your support.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-start" ref={formReveal.ref}>
          
          {/* Contact Info (Staggered) */}
          <motion.div 
            initial="hidden" animate={formReveal.isInView ? "visible" : "hidden"}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
            }}
            className="lg:col-span-2 space-y-6"
          >
            {[
              { icon: <Mail size={24} />, title: "Email Us", desc: "support@hermesai.io", sub: "Response within 24h" },
              { icon: <Phone size={24} />, title: "Call Support", desc: "+1 (555) 012-3456", sub: "Mon-Fri, 9am-6pm PST" },
              { icon: <MapPin size={24} />, title: "Visit Us", desc: "123 Tech Plaza", sub: "San Francisco, CA 94103" }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                variants={{
                  hidden: { opacity: 0, x: -30 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
                }}
                className="flex items-start gap-6 p-6 rounded-2xl bg-surface/30 backdrop-blur-sm border border-border/50 group hover:bg-surface hover:border-primary/50 transition-colors duration-500 cursor-default"
              >
                <div className="p-4 bg-bg text-primary rounded-xl group-hover:scale-110 transition-transform duration-500 shadow-inner">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-text font-medium">{item.desc}</p>
                  <p className="text-sm text-muted mt-1">{item.sub}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }} animate={formReveal.isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-3 rounded-4xl bg-surface/40 backdrop-blur-xl border border-border p-8 md:p-12 relative overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
            
            <h2 className="text-3xl font-bold text-white mb-10">Send a Message</h2>
            
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="py-16 text-center flex flex-col items-center justify-center h-full"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
                  >
                    <CheckCircle size={80} className="text-success mb-6 drop-shadow-[0_0_20px_rgba(16,185,129,0.4)]" />
                  </motion.div>
                  <h3 className="text-3xl font-bold text-white mb-4">Message Sent!</h3>
                  <p className="text-lg text-muted max-w-md mx-auto">Thank you for reaching out. Our team is reviewing your inquiry and will respond shortly.</p>
                </motion.div>
              ) : (
                <motion.form 
                  key="form"
                  onSubmit={onSubmit} 
                  className="space-y-8 relative z-10"
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Floating Label Input Group */}
                    <div className="relative group">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={onChange}
                        required
                        className="peer w-full bg-transparent border-b-2 border-border/50 px-0 py-3 text-white placeholder-transparent focus:outline-none focus:border-primary transition-colors"
                        placeholder="John Doe"
                      />
                      <label 
                        htmlFor="name" 
                        className="absolute left-0 -top-3.5 text-sm text-primary transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-muted peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-primary cursor-text"
                      >
                        Full Name
                      </label>
                    </div>
                    
                    <div className="relative group">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={onChange}
                        required
                        className="peer w-full bg-transparent border-b-2 border-border/50 px-0 py-3 text-white placeholder-transparent focus:outline-none focus:border-primary transition-colors"
                        placeholder="john@company.com"
                      />
                      <label 
                        htmlFor="email" 
                        className="absolute left-0 -top-3.5 text-sm text-primary transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-muted peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-primary cursor-text"
                      >
                        Work Email
                      </label>
                    </div>
                  </div>
                  
                  <div className="relative group pt-4">
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={onChange}
                      required
                      rows="4"
                      className="peer w-full bg-transparent border-b-2 border-border/50 px-0 py-3 text-white placeholder-transparent focus:outline-none focus:border-primary transition-colors resize-none"
                      placeholder="Tell us about your support needs..."
                    ></textarea>
                    <label 
                      htmlFor="message" 
                      className="absolute left-0 top-0 text-sm text-primary transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-muted peer-placeholder-shown:top-7 peer-focus:top-0 peer-focus:text-sm peer-focus:text-primary cursor-text"
                    >
                      How can we help?
                    </label>
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="relative w-full overflow-hidden bg-primary text-white font-bold py-5 rounded-xl group transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_40px_rgba(99,102,241,0.5)]"
                  >
                    {/* Ripple/Glow effect */}
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                    
                    <div className="relative z-10 flex items-center justify-center gap-3 text-lg">
                      {loading ? (
                        <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          Send Inquiry
                          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </div>
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
