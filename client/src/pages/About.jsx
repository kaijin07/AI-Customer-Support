import React, { useRef, useLayoutEffect, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Bot, Shield, Zap, Target, Users, Cpu, ArrowRight } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const rootRef = useRef(null);
  const bgRef = useRef(null);
  const introWrapRef = useRef(null);

  const missionReveal = useScrollReveal({ margin: '-200px' });
  const visionReveal = useScrollReveal({ margin: '-200px' });
  const techReveal = useScrollReveal();

  const missionDone = useRef(false);
  const visionDone = useRef(false);
  const techDone = useRef(false);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const bg = bgRef.current;
    const intro = introWrapRef.current;
    if (!root) return undefined;

    const ctx = gsap.context(() => {
      if (bg) {
        gsap.fromTo(
          bg,
          { yPercent: 0 },
          {
            yPercent: 50,
            ease: 'none',
            scrollTrigger: {
              trigger: root,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      }

      if (intro) {
        gsap.fromTo(
          intro,
          { opacity: 1 },
          {
            opacity: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: intro,
              start: 'top top',
              end: '+=25%',
              scrub: true,
            },
          }
        );
      }
    }, root);

    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    gsap.fromTo(
      '.about-intro-title',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0 }
    );
    gsap.fromTo(
      '.about-intro-p',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.2 }
    );
  }, []);

  useEffect(() => {
    if (!missionReveal.isInView || missionDone.current) return;
    const block = missionReveal.ref.current?.querySelector('[data-mission-block]');
    if (!block) return;
    missionDone.current = true;
    gsap.from(block, { opacity: 0, x: -50, duration: 0.8, ease: 'power3.out' });
  }, [missionReveal.isInView]);

  useEffect(() => {
    if (!visionReveal.isInView || visionDone.current) return;
    const block = visionReveal.ref.current?.querySelector('[data-vision-block]');
    if (!block) return;
    visionDone.current = true;
    gsap.from(block, { opacity: 0, x: 50, duration: 0.8, ease: 'power3.out' });
  }, [visionReveal.isInView]);

  useEffect(() => {
    if (!techReveal.isInView || techDone.current) return;
    const grid = techReveal.ref.current?.querySelector('[data-tech-grid]');
    if (!grid?.children?.length) return;
    techDone.current = true;
    gsap.from(grid.children, {
      opacity: 0,
      y: 50,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
    });
  }, [techReveal.isInView]);

  return (
    <div ref={rootRef} className="flex-1 w-full bg-bg pt-32 pb-24 overflow-hidden text-text relative">
      <div
        ref={bgRef}
        className="absolute inset-0 pointer-events-none z-0 flex flex-col justify-between opacity-20"
      >
        <div className="w-[120vw] h-[50vh] bg-primary/10 blur-[150px] rounded-full ml-[-10vw] mt-[-20vh]" />
        <div className="w-screen h-[60vh] bg-accent/5 blur-[120px] rounded-full translate-x-1/2" />
        <div className="w-[120vw] h-[50vh] bg-primary/10 blur-[150px] rounded-full ml-[-10vw]" />
      </div>

      <section className="relative min-h-[70vh] flex flex-col justify-center items-center text-center px-4 z-10">
        <div ref={introWrapRef} className="max-w-4xl mx-auto">
          <h1 className="about-intro-title text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
            The Future of <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-accent">
              Human-Bot
            </span>{' '}
            Collaboration
          </h1>
          <p className="about-intro-p text-lg md:text-xl text-muted font-light leading-relaxed max-w-3xl mx-auto">
            Hermes AI is built on the philosophy that AI shouldn&apos;t replace human support—it should empower it. We
            handle the noise, so you can focus on the complexity.
          </p>
        </div>
      </section>

      <section className="relative w-full py-40 px-4 z-10" ref={missionReveal.ref}>
        <div className="max-w-6xl mx-auto">
          <div data-mission-block className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 order-2 lg:order-1">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                <Target size={32} />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold">The Mission</h2>
              <p className="text-xl text-muted leading-relaxed font-light">
                We started Hermes AI because we saw support teams drowning in repetitive tasks. Our mission is to provide
                every business with an intelligent layer that filters common queries, handles routine operations, and
                seamlessly hands over complex issues to experts.
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
          </div>
        </div>
      </section>

      <section
        className="relative w-full py-40 px-4 z-10 bg-surface/30 border-y border-border/30"
        ref={visionReveal.ref}
      >
        <div className="max-w-6xl mx-auto">
          <div data-vision-block className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative h-[400px] lg:h-[600px] w-full rounded-4xl overflow-hidden group">
              <div className="absolute inset-0 bg-surface/40 backdrop-blur-md border border-border/50 rounded-4xl z-10" />
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <Bot
                  size={150}
                  className="text-accent opacity-20 group-hover:scale-110 group-hover:opacity-40 transition-all duration-1000 ease-out"
                />
              </div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-accent)_0%,transparent_70%)] opacity-5 z-0" />
            </div>

            <div className="space-y-8">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center text-accent shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                <Users size={32} />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold">The Vision</h2>
              <p className="text-xl text-muted leading-relaxed font-light">
                A world where no customer has to wait in a queue, and no agent has to answer the same question twice. We
                envision AI as a co-pilot that elevates the human experience.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 text-accent hover:text-white font-bold tracking-wide transition-colors group"
              >
                Partner with us
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative w-full py-40 px-4 z-10" ref={techReveal.ref}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Built by Engineers, for Everyone</h2>
            <p className="text-xl text-muted max-w-2xl mx-auto font-light">
              We leverage cutting-edge LLMs and custom RAG architectures to deliver uncompromising quality.
            </p>
          </div>

          <div data-tech-grid className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Cpu />,
                title: 'Intelligent Logic',
                desc: 'Multi-stage reasoning to decide when to answer and when to escalate.',
              },
              {
                icon: <Zap />,
                title: 'Instant Scaling',
                desc: 'Handles 10 or 10,000 customers simultaneously without latency.',
              },
              {
                icon: <Shield />,
                title: 'Data Sovereignty',
                desc: 'Enterprise-grade encryption. Never used for public model training.',
              },
            ].map((v, i) => (
              <div
                key={i}
                className="p-10 rounded-3xl bg-surface/50 border border-border backdrop-blur-sm group hover:bg-surface hover:border-primary/30 transition-colors duration-500"
              >
                <div className="text-primary mb-8 transform group-hover:scale-110 group-hover:-translate-y-1 transition-transform duration-500">
                  {React.cloneElement(v.icon, { size: 40 })}
                </div>
                <h3 className="text-2xl font-bold mb-4">{v.title}</h3>
                <p className="text-muted leading-relaxed font-light">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
