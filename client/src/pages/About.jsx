import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Bot, Shield, Zap, Target, Users, Cpu, ArrowRight } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { Link } from 'react-router-dom';

const About = () => {
  const { scrollYProgress } = useScroll();
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacityFade = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const introReveal = useScrollReveal();
  const missionReveal = useScrollReveal({ margin: "-200px" });
  const visionReveal = useScrollReveal({ margin: "-200px" });
  const techReveal = useScrollReveal();

  return (
    <div className="flex-1 w-full bg-bg pt-32 pb-24 overflow-hidden text-text relative">
      
      {/* Global Parallax Background Layer */}
      <motion.div 
        style={{ y: bgY }}
        className="absolute inset-0 pointer-events-none z-0 flex flex-col justify-between opacity-20"
      >
        <div className="w-[120vw] h-[50vh] bg-primary/10 blur-[150px] rounded-full ml-[-10vw] mt-[-20vh]" />
        <div className="w-screen h-[60vh] bg-accent/5 blur-[120px] rounded-full translate-x-1/2" />
        <div className="w-[120vw] h-[50vh] bg-primary/10 blur-[150px] rounded-full ml-[-10vw]" />
      </motion.div>

      {/* 1. Intro -> fade in text block */}
      <section className="relative min-h-[70vh] flex flex-col justify-center items-center text-center px-4 z-10">
        <motion.div 
          style={{ opacity: opacityFade }}
          className="max-w-4xl mx-auto"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight"
          >
            The Future of <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-accent">Human-Bot</span> Collaboration
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-xl text-muted font-light leading-relaxed max-w-3xl mx-auto"
          >
            Hermes AI is built on the philosophy that AI shouldn't replace human support—it should empower it. We handle the noise, so you can focus on the complexity.
          </motion.p>
        </motion.div>
      </section>

      {/* 2. Mission -> slide from left */}
      <section className="relative w-full py-40 px-4 z-10" ref={missionReveal.ref}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hiddenLeft" animate={missionReveal.isInView ? "visibleLeft" : "hiddenLeft"} variants={missionReveal.variants}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          >
            <div className="space-y-8 order-2 lg:order-1">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                <Target size={32} />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold">The Mission</h2>
              <p className="text-xl text-muted leading-relaxed font-light">
                We started Hermes AI because we saw support teams drowning in repetitive tasks. Our mission is to provide every business with an intelligent layer that filters common queries, handles routine operations, and seamlessly hands over complex issues to experts.
              </p>
              <div className="flex gap-8 pt-4">
                <div className="border-l-2 border-primary pl-6">
                  <p className="text-4xl font-black text-white mb-1">99%</p>
                  <p className="text-sm text-muted font-medium uppercase tracking-widest">Uptime SLA</p>
                </div>
                <div className="border-l-2 border-accent pl-6">
                  <p className="text-4xl font-black text-white mb-1">24/7</p>
                  <p className="text-sm text-muted font-medium uppercase tracking-widest">Instant Support</p>
                </div>
              </div>
            </div>
            <div className="relative order-1 lg:order-2 h-[400px] lg:h-[600px] w-full rounded-4xl overflow-hidden group">
              <div className="absolute inset-0 bg-surface/40 backdrop-blur-md border border-border/50 rounded-4xl z-10" />
              <img 
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop" 
                alt="Support Team" 
                className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-1000 ease-out"
              />
              <div className="absolute inset-0 bg-linear-to-t from-bg via-transparent to-transparent z-20" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. Vision -> slide from right */}
      <section className="relative w-full py-40 px-4 z-10 bg-surface/30 border-y border-border/30" ref={visionReveal.ref}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hiddenRight" animate={visionReveal.isInView ? "visibleRight" : "hiddenRight"} variants={visionReveal.variants}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          >
             <div className="relative h-[400px] lg:h-[600px] w-full rounded-4xl overflow-hidden group">
              <div className="absolute inset-0 bg-surface/40 backdrop-blur-md border border-border/50 rounded-4xl z-10" />
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <Bot size={150} className="text-accent opacity-20 group-hover:scale-110 group-hover:opacity-40 transition-all duration-1000 ease-out" />
              </div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-accent)_0%,transparent_70%)] opacity-5 z-0" />
            </div>

            <div className="space-y-8">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center text-accent shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                <Users size={32} />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold">The Vision</h2>
              <p className="text-xl text-muted leading-relaxed font-light">
                A world where no customer has to wait in a queue, and no agent has to answer the same question twice. We envision AI as a co-pilot that elevates the human experience.
              </p>
              <Link to="/contact" className="inline-flex items-center gap-2 text-accent hover:text-white font-bold tracking-wide transition-colors group">
                Partner with us
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. Tech -> stagger cards */}
      <section className="relative w-full py-40 px-4 z-10" ref={techReveal.ref}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Built by Engineers, for Everyone</h2>
            <p className="text-xl text-muted max-w-2xl mx-auto font-light">
              We leverage cutting-edge LLMs and custom RAG architectures to deliver uncompromising quality.
            </p>
          </div>

          <motion.div 
            initial="hidden" animate={techReveal.isInView ? "visible" : "hidden"}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
            }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { icon: <Cpu />, title: "Intelligent Logic", desc: "Multi-stage reasoning to decide when to answer and when to escalate." },
              { icon: <Zap />, title: "Instant Scaling", desc: "Handles 10 or 10,000 customers simultaneously without latency." },
              { icon: <Shield />, title: "Data Sovereignty", desc: "Enterprise-grade encryption. Never used for public model training." }
            ].map((v, i) => (
              <motion.div 
                key={i} 
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
                }}
                className="p-10 rounded-3xl bg-surface/50 border border-border backdrop-blur-sm group hover:bg-surface hover:border-primary/30 transition-colors duration-500"
              >
                <div className="text-primary mb-8 transform group-hover:scale-110 group-hover:-translate-y-1 transition-transform duration-500">
                  {React.cloneElement(v.icon, { size: 40 })}
                </div>
                <h3 className="text-2xl font-bold mb-4">{v.title}</h3>
                <p className="text-muted leading-relaxed font-light">{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default About;
