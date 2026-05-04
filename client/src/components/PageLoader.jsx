import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import BrandLogo from './BrandLogo.jsx';

/**
 * First-paint splash: progress bar fills, then panel slides up. Skipped when reduced motion is requested.
 */
export default function PageLoader() {
  const panelRef = useRef(null);
  const innerRef = useRef(null);
  const barFillRef = useRef(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const panel = panelRef.current;
    const inner = innerRef.current;
    const barFill = barFillRef.current;
    if (!panel || !inner || !barFill) return undefined;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(false);
      return undefined;
    }

    let cancelled = false;
    const ctx = gsap.context(() => {
      gsap.set(barFill, { scaleX: 0, transformOrigin: 'left center' });

      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        onComplete: () => {
          if (!cancelled) setVisible(false);
        },
      });

      tl.from(inner, { opacity: 0, y: 10, duration: 0.4, delay: 0.06 }, 0)
        .to(barFill, { scaleX: 1, duration: 0.58, ease: 'power1.inOut' }, 0.12)
        .to(
          panel,
          {
            yPercent: -100,
            duration: 0.78,
            ease: 'power3.inOut',
          },
          '>-0.02'
        );
    }, panel);

    return () => {
      cancelled = true;
      ctx.revert();
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={panelRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-bg"
      style={{ willChange: 'transform' }}
      role="status"
      aria-live="polite"
    >
      <div ref={innerRef} className="flex flex-col items-center gap-6 px-6">
        <BrandLogo variant="compact" className="opacity-95" />
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted">Loading</p>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-[3px] bg-border/60"
        aria-hidden
      >
        <div
          ref={barFillRef}
          className="h-full w-full bg-linear-to-r from-primary via-primary-hover to-accent opacity-90"
        />
      </div>
    </div>
  );
}
