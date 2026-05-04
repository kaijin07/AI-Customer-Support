import React, { useRef, useLayoutEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowRight, MessageCircle, Zap, TrendingUp, Shield, Sparkles } from 'lucide-react';

// ─── Animated Heading (GSAP staggered letter-wave) ───────────────────────────
// Each character is an inline-block span so GSAP can move it independently
// without any layout shift. Spaces are preserved as-is.
function LetterLine({ text, accentColor = false, className = '' }) {
  const containerRef = useRef(null);
  const tlRef = useRef(null);

  const onEnter = useCallback(() => {
    if (!containerRef.current) return;
    const letters = containerRef.current.querySelectorAll('.h-letter');
    if (tlRef.current) tlRef.current.kill();
    tlRef.current = gsap.timeline();
    tlRef.current.to(letters, {
      y: -10,
      // Slightly lighter / more vivid on hover via brightness
      filter: accentColor ? 'brightness(1.22)' : 'brightness(1.0)',
      color: accentColor ? undefined : 'var(--color-primary-hover)',
      duration: 0.42,
      ease: 'power2.out',
      stagger: {
        each: 0.028,   // 28 ms between each letter — smooth wave, not instant
        from: 'start',
      },
    });
  }, [accentColor]);

  const onLeave = useCallback(() => {
    if (!containerRef.current) return;
    const letters = containerRef.current.querySelectorAll('.h-letter');
    if (tlRef.current) tlRef.current.kill();
    tlRef.current = gsap.timeline();
    tlRef.current.to(letters, {
      y: 0,
      filter: 'brightness(1.0)',
      color: accentColor ? undefined : 'var(--color-text)',
      duration: 0.55,
      ease: 'power3.out',
      stagger: {
        each: 0.022,
        from: 'end',  // reverse the wave on leave — satisfying
      },
    });
  }, [accentColor]);

  return (
    <span
      ref={containerRef}
      className={`inline-block overflow-visible ${className}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      aria-label={text}
    >
      {text.split('').map((ch, i) =>
        ch === ' ' ? (
          // Hard space — preserves natural kerning, zero width tricks
          <span key={i} className="inline-block" style={{ width: '0.28em' }} aria-hidden="true" />
        ) : (
          <span
            key={i}
            className="h-letter inline-block will-change-transform"
            aria-hidden="true"
            style={accentColor ? {
              // Gradient text via background-clip — applied once, static;
              // brightness filter animates it on hover without re-painting
              background: 'linear-gradient(135deg, #8b84e0 0%, #a78bfa 45%, #6d67c8 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              display: 'inline-block',
            } : {
              color: 'var(--color-text)',
              display: 'inline-block',
            }}
          >
            {ch}
          </span>
        )
      )}
    </span>
  );
}

function AnimatedHeading() {
  return (
    <h1
      className="hero-intro-title-line pointer-events-auto mb-6 font-sans text-[2rem] font-extrabold leading-[1.12] tracking-[-0.025em] sm:mb-8 sm:text-4xl sm:leading-[1.1] md:text-5xl md:leading-[1.08] cursor-default select-none"
    >
      {/* Line 1 — white letters that turn purple on hover */}
      <LetterLine text="Smarter replies," className="block" />
      {/* Line 2 — gradient letters that brighten on hover */}
      <LetterLine text="happier customers" accentColor className="inline" />
      <span
        className="inline-block"
        style={{ color: 'var(--color-primary)', marginLeft: '0.04em' }}
      >.</span>
    </h1>
  );
}

const CONVO = [
  { id: '1', kind: 'user', text: 'Hey! I need help with my order #4821.' },
  { id: '2', kind: 'ai', text: 'HERMES AI: I found your order — it ships tomorrow by 6 PM! 🚀' },
  { id: '3', kind: 'user', text: 'Can I get a refund for this product?' },
  { id: '4', kind: 'ai', text: 'HERMES AI: Absolutely — refund processed in 2–3 business days.' },
  { id: '5', kind: 'ai', text: 'HERMES AI: Response times dropped ~80%. 📈' },
];

const LEFT_STRIP = [CONVO[0], CONVO[1]];
const RIGHT_STRIP = [CONVO[2], CONVO[3], CONVO[4]];

function Bubble({ bubble, className = '' }) {
  const isUser = bubble.kind === 'user';
  const onEnter = useCallback(
    (e) => {
      gsap.to(e.currentTarget, {
        scale: 1.03,
        duration: 0.28,
        ease: 'power2.out',
      });
      gsap.to(e.currentTarget, {
        boxShadow: isUser
          ? '0 12px 36px rgba(0,0,0,0.35), 0 0 0 1px rgba(99,102,241,0.2)'
          : '0 12px 36px rgba(99,102,241,0.3), 0 0 0 1px rgba(34,211,238,0.15)',
        duration: 0.28,
      });
    },
    [isUser]
  );

  const onLeave = useCallback((e) => {
    gsap.to(e.currentTarget, { scale: 1, duration: 0.3, ease: 'power3.out' });
    gsap.to(e.currentTarget, {
      boxShadow: isUser
        ? '0 6px 24px rgba(0,0,0,0.22)'
        : '0 6px 22px rgba(99,102,241,0.18)',
      duration: 0.3,
    });
  }, [isUser]);

  return (
    <div
      role="presentation"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={`hero-bubble w-full max-w-[min(280px,calc((100vw-2rem)*0.88))] rounded-2xl px-4 py-3 text-left text-[13px] leading-snug pointer-events-auto cursor-default select-none will-change-transform ${
        isUser
          ? 'bg-surface border border-border/90 text-text/95 shadow-[0_6px_24px_rgba(0,0,0,0.22)] rounded-bl-md'
          : 'bg-linear-to-br from-primary to-primary-hover text-white border border-white/10 shadow-[0_6px_22px_rgba(99,102,241,0.18)] rounded-br-md'
      } ${className}`}
    >
      <p>
        {!isUser && (
          <span className="text-[10px] font-semibold uppercase tracking-wider text-white/85 block mb-1">
            Hermes
          </span>
        )}
        {isUser ? bubble.text : bubble.text.replace(/^HERMES AI:\s*/i, '')}
      </p>
    </div>
  );
}

function BubbleMessage({ bubble }) {
  const isUser = bubble.kind === 'user';
  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[92%] rounded-2xl px-3 py-2.5 text-[12px] sm:text-[13px] leading-snug ${
          isUser
            ? 'bg-surface border border-border/80 text-text rounded-br-md'
            : 'bg-primary/95 border border-primary/30 text-white rounded-bl-md'
        }`}
      >
        {!isUser && (
          <span className="text-[10px] font-semibold uppercase tracking-wide text-accent/90 block mb-1">
            Hermes
          </span>
        )}
        {isUser
          ? bubble.text
          : bubble.text.replace(/^HERMES AI:\s*/, '')}
      </div>
    </div>
  );
}

export default function HomeHero() {
  const rootRef = useRef(null);
  const ctaPrimaryRef = useRef(null);
  const ctaSecondaryRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const ctx = gsap.context(() => {
      const bubbles = gsap.utils.toArray('.hero-bubble');

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('.hero-intro-badge', {
        opacity: 0,
        y: 14,
        scale: 0.96,
        duration: 0.5,
      })
        .from('.hero-intro-title-line', { opacity: 0, y: 22, duration: 0.6 }, '-=0.22')
        .from('.hero-intro-sub', { opacity: 0, y: 16, duration: 0.5 }, '-=0.32')
        .from('.hero-intro-cta', { opacity: 0, y: 14, duration: 0.45 }, '-=0.28')
        .from(
          '.hero-mobile-preview',
          { opacity: 0, y: 20, duration: 0.5 },
          '-=0.35'
        )
        .from(
          '.hero-stat-card',
          {
            opacity: 0,
            y: 20,
            duration: 0.5,
            stagger: 0.1,
          },
          '-=0.28'
        )
        .from(
          bubbles,
          {
            opacity: 0,
            scale: 0.94,
            y: 16,
            duration: 0.5,
            stagger: { each: 0.06, from: 'random' },
            ease: 'back.out(1.1)',
          },
          '-=0.45'
        );

      tl.call(() => {
        bubbles.forEach((el, i) => {
          if (!el) return;
          const dur = 2.8 + (i % 4) * 0.32;
          const yAmt = 4 + ((i * 7) % 8);
          const xAmt = 1.5 + ((i * 5) % 3);
          const rot = ((i % 2 === 0 ? 1 : -1) * (0.35 + (i % 3) * 0.2)) / 2;
          gsap.to(el, {
            y: `+=${yAmt}`,
            x: i % 2 === 0 ? `+=${xAmt}` : `-=${xAmt}`,
            rotation: rot,
            duration: dur,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: i * 0.07,
          });
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  const onPrimaryEnter = () => {
    if (!ctaPrimaryRef.current) return;
    gsap.to(ctaPrimaryRef.current, {
      scale: 1.02,
      y: -2,
      duration: 0.32,
      ease: 'power2.out',
    });
    gsap.to(ctaPrimaryRef.current, {
      boxShadow: '0 14px 36px rgba(99,102,241,0.42)',
      duration: 0.32,
    });
  };

  const onPrimaryLeave = () => {
    if (!ctaPrimaryRef.current) return;
    gsap.to(ctaPrimaryRef.current, {
      scale: 1,
      y: 0,
      duration: 0.38,
      ease: 'power3.out',
    });
    gsap.to(ctaPrimaryRef.current, {
      boxShadow: '0 0 18px rgba(99,102,241,0.25)',
      duration: 0.38,
    });
  };

  const onSecondaryEnter = () => {
    if (!ctaSecondaryRef.current) return;
    gsap.to(ctaSecondaryRef.current, {
      scale: 1.02,
      y: -1,
      borderColor: 'rgba(99, 102, 241, 0.4)',
      duration: 0.28,
      ease: 'power2.out',
    });
  };

  const onSecondaryLeave = () => {
    if (!ctaSecondaryRef.current) return;
    gsap.to(ctaSecondaryRef.current, {
      scale: 1,
      y: 0,
      borderColor: 'var(--color-border)',
      duration: 0.32,
      ease: 'power3.out',
    });
  };

  return (
    <section
      ref={rootRef}
      className="relative w-full flex flex-col justify-center px-4 sm:px-6 pt-[7.25rem] sm:pt-32 pb-10 sm:pb-14 lg:pb-16 overflow-hidden z-10 lg:min-h-0 lg:py-24 xl:py-28"
    >
      <div className="absolute inset-0 pointer-events-none -z-[5] overflow-hidden">
        <div className="absolute top-[18%] left-1/2 -translate-x-1/2 w-[min(92vw,56rem)] h-[42vh] max-h-[420px] bg-primary/14 blur-[100px] rounded-full" />
        <div className="absolute bottom-[8%] right-[8%] w-[55vw] max-w-md h-[32vh] bg-accent/10 blur-[90px] rounded-full" />
      </div>

      <div className="relative z-[15] w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-10 items-start lg:items-center">
          <aside className="hidden lg:flex lg:col-span-3 flex-col gap-5 xl:gap-6 items-end self-center pr-2">
            {LEFT_STRIP.map((b) => (
              <Bubble key={b.id} bubble={b} />
            ))}
          </aside>

          <div className="lg:col-span-6 flex flex-col items-center text-center w-full max-w-xl mx-auto lg:mx-auto px-1 sm:px-2 pointer-events-none">
            <div className="hero-intro-badge group/badge pointer-events-auto mb-7 inline-flex items-center gap-2.5 rounded-full border border-border/70 bg-surface/90 px-4 py-2 text-[11px] font-medium text-muted shadow-sm backdrop-blur-md transition-[border-color,box-shadow,transform] duration-300 sm:mb-9 sm:text-xs md:hover:-translate-y-0.5 md:hover:border-primary/35 md:hover:shadow-[0_8px_28px_rgba(99,102,241,0.12)]">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent shadow-[0_0_12px_var(--color-accent)]" />
              </span>
              <span className="text-[11px] font-semibold uppercase leading-tight tracking-wide transition-[letter-spacing,color] duration-300 sm:text-xs md:group-hover/badge:tracking-[0.12em] md:group-hover/badge:text-text">
                AI-powered customer support
              </span>
            </div>

            <AnimatedHeading />

            <p className="hero-intro-sub pointer-events-auto mx-auto mb-9 max-w-[22rem] text-[15px] font-normal leading-relaxed text-muted/95 transition-[color,transform] duration-300 hover:text-text/90 sm:mb-11 sm:max-w-lg sm:text-base md:text-lg md:hover:-translate-y-0.5">
              Deploy Hermes on your site in minutes. Train once from your docs and tickets — visitors get
              accurate, on-brand answers 24/7.
            </p>

            <div className="hero-intro-cta flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 w-full max-w-md sm:max-w-none pointer-events-auto">
              <Link
                ref={ctaPrimaryRef}
                to="/signup"
                onMouseEnter={onPrimaryEnter}
                onMouseLeave={onPrimaryLeave}
                className="min-h-[48px] sm:min-h-[44px] inline-flex items-center justify-center gap-2 rounded-xl px-6 sm:px-7 py-3.5 bg-primary hover:bg-primary-hover text-white text-[15px] font-semibold tracking-[-0.01em] shadow-[0_0_18px_rgba(99,102,241,0.25)] will-change-transform transition-colors duration-200"
              >
                Get started — it&apos;s free
                <ArrowRight size={18} className="shrink-0 opacity-95" aria-hidden />
              </Link>
              <Link
                ref={ctaSecondaryRef}
                to="/about"
                onMouseEnter={onSecondaryEnter}
                onMouseLeave={onSecondaryLeave}
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-border bg-surface/95 px-6 py-3.5 text-[15px] font-semibold tracking-[-0.01em] text-text backdrop-blur-sm transition-colors duration-200 will-change-transform hover:bg-surface sm:min-h-[44px] sm:px-7"
              >
                <MessageCircle size={18} className="text-accent shrink-0" aria-hidden />
                See it in action
              </Link>
            </div>
          </div>

          <aside className="hidden lg:flex lg:col-span-3 flex-col gap-5 xl:gap-6 items-start self-center pl-2">
            {RIGHT_STRIP.map((b) => (
              <Bubble key={b.id} bubble={b} />
            ))}
          </aside>
        </div>

        <div className="hero-mobile-preview lg:hidden mt-10 sm:mt-12 w-full max-w-md mx-auto pointer-events-auto">
          <div className="rounded-2xl border border-border/80 bg-surface/80 backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.28)] overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border/70 bg-bg/40">
              <Sparkles size={16} className="text-accent shrink-0" aria-hidden />
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">Live preview</p>
                <p className="text-sm font-medium text-white truncate">Widget conversation</p>
              </div>
            </div>
            <div className="px-3 py-4 space-y-3 max-h-[min(52vh,320px)] overflow-y-auto scrollbar-hide">
              {CONVO.map((b) => (
                <BubbleMessage key={b.id} bubble={b} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-[15] mt-12 sm:mt-14 lg:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-5 max-w-5xl mx-auto w-full px-0 sm:px-1">
        {[
          { icon: Zap, stat: '<1 min', label: 'To your first reply' },
          { icon: TrendingUp, stat: '80%+', label: 'Issues auto-resolved' },
          { icon: Shield, stat: '99.9%', label: 'Uptime you can rely on' },
        ].map((row, i) => {
          const StatIcon = row.icon;
          return (
          <div
            key={row.label}
            className="hero-stat-card group relative overflow-hidden rounded-2xl bg-surface/75 border border-border/70 px-5 py-5 sm:px-6 sm:py-5 md:py-6 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.18)] transition-[transform,border-color] duration-300 active:scale-[0.99] sm:hover:-translate-y-1 sm:hover:border-primary/35 sm:hover:shadow-[0_12px_36px_rgba(99,102,241,0.14)] cursor-default"
            onMouseEnter={(e) => {
              if (window.matchMedia('(hover: hover)').matches) {
                gsap.to(e.currentTarget.querySelector('.stat-icon-wrap'), {
                  scale: 1.1,
                  rotation: i % 2 === 0 ? 3 : -3,
                  duration: 0.32,
                  ease: 'power2.out',
                });
              }
            }}
            onMouseLeave={(e) => {
              gsap.to(e.currentTarget.querySelector('.stat-icon-wrap'), {
                scale: 1,
                rotation: 0,
                duration: 0.36,
                ease: 'power3.out',
              });
            }}
          >
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div className="flex items-start gap-3 sm:gap-4 relative">
              <div className="stat-icon-wrap shrink-0 p-2.5 rounded-xl bg-primary/12 text-primary border border-primary/20">
                <StatIcon size={20} className="sm:w-[22px] sm:h-[22px]" />
              </div>
              <div className="text-left min-w-0 flex-1">
                <p className="text-lg font-bold tracking-tight text-text sm:text-xl md:text-2xl">{row.stat}</p>
                <p className="mt-1 text-[13px] font-medium leading-snug text-muted transition-colors duration-300 group-hover:text-primary sm:text-sm">
                  {row.label}
                </p>
              </div>
            </div>
          </div>
        );
        })}
      </div>
    </section>
  );
}
