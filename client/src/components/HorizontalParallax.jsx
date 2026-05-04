import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Reliable horizontal travel (avoids scrollWidth quirks on absolutely positioned flex tracks). */
function measureHorizontalTravel(track) {
  const items = track.children;
  if (!items.length) return 0;
  const cs = getComputedStyle(track);
  const gap = parseFloat(cs.columnGap || cs.gap) || 0;
  const padL = parseFloat(cs.paddingLeft) || 0;
  const padR = parseFloat(cs.paddingRight) || 0;
  let row = padL + padR;
  for (let i = 0; i < items.length; i++) {
    row += items[i].getBoundingClientRect().width;
    if (i < items.length - 1) row += gap;
  }
  const dist = row - window.innerWidth;
  return Number.isFinite(dist) ? Math.max(0, Math.round(dist)) : 0;
}

function ReducedMotionStory({
  title,
  storyKicker,
  headlineTop,
  headlineAccent,
  subtitle,
  ctaEyebrow,
  ctaHeadline,
  children,
}) {
  return (
    <section
      className="relative w-full bg-bg py-24 border-y border-border/30 overflow-hidden"
      aria-label={title}
    >
      <div className="absolute inset-0 pointer-events-none opacity-30 z-0 flex justify-center items-center">
        <div className="w-[80vw] h-[50vh] bg-primary/10 blur-[150px] rounded-[100%]" />
      </div>
      <div className="relative z-10 px-[8vw] mb-12">
        <p className="text-xs tracking-[0.2em] text-muted uppercase mb-4">— {storyKicker}</p>
        <h2 className="mb-4 text-4xl font-extrabold leading-[1.05] tracking-tight text-text md:text-5xl">
          {headlineTop}
          <br />
          <span className="text-accent">{headlineAccent}</span>
        </h2>
        <p className="text-muted max-w-xl text-base md:text-lg leading-relaxed">{subtitle}</p>
      </div>
      <div className="relative z-10 flex overflow-x-auto gap-8 md:gap-12 px-[8vw] pb-16 scrollbar-hide snap-x snap-mandatory overscroll-x-contain touch-pan-x">
        {React.Children.map(children, (child, i) => (
          <div key={i} className="shrink-0 w-[min(85vw,600px)] snap-start">
            {child}
          </div>
        ))}
        <div className="shrink-0 w-[min(85vw,380px)] flex flex-col justify-center snap-start border-l border-border/40 pl-10">
          <span className="mb-3 text-sm font-medium tracking-wide text-accent">{ctaEyebrow}</span>
          <p className="text-2xl font-bold leading-tight text-text">{ctaHeadline}</p>
        </div>
      </div>
    </section>
  );
}

/**
 * Pinned horizontal storytelling (GSAP ScrollTrigger).
 * z-index is raised only while the trigger is active so content below is not permanently covered.
 */
const HorizontalParallax = ({
  title = 'How Hermes works',
  storyKicker = 'Hermes · product tour',
  headlineTop = 'Hermes in motion.',
  headlineAccent = 'One scroll.',
  subtitle = 'Train from your docs, embed the widget, and manage escalations from a single dashboard.',
  scrollHint = 'Scroll · explore',
  ctaEyebrow = 'Next step',
  ctaHeadline = 'Start answering on autopilot.',
  children,
}) => {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useLayoutEffect(() => {
    if (prefersReduced) return undefined;
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return undefined;

    let roTimer;
    const scheduleRefresh = () => {
      window.clearTimeout(roTimer);
      roTimer = window.setTimeout(() => {
        ScrollTrigger.refresh();
      }, 120);
    };

    // Trackpads send chained wheel events differently than dragging the scrollbar; combined with pin +
    // nested overflow areas, the browser can stall scroll. normalizeScroll delegates wheel/touch to GSAP.
    ScrollTrigger.normalizeScroll({
      allowNestedScroll: true,
    });

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: () => -measureHorizontalTravel(track),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          pin: true,
          pinSpacing: true,
          scrub: true,
          start: 'top top',
          end: () => `+=${measureHorizontalTravel(track)}`,
          invalidateOnRefresh: true,
          anticipatePin: 0,
          onToggle: (self) => {
            section.style.zIndex = self.isActive ? '25' : '';
          },
        },
      });
    }, section);

    const onLoad = () => ScrollTrigger.refresh();
    if (document.readyState === 'complete') requestAnimationFrame(onLoad);
    else window.addEventListener('load', onLoad);

    const ro = new ResizeObserver(scheduleRefresh);
    ro.observe(track);

    return () => {
      window.removeEventListener('load', onLoad);
      window.clearTimeout(roTimer);
      ro.disconnect();
      section.style.zIndex = '';
      ctx.revert();
      ScrollTrigger.normalizeScroll(false);
      requestAnimationFrame(() => ScrollTrigger.refresh());
    };
  }, [prefersReduced]);

  if (prefersReduced) {
    return (
      <ReducedMotionStory
        title={title}
        storyKicker={storyKicker}
        headlineTop={headlineTop}
        headlineAccent={headlineAccent}
        subtitle={subtitle}
        ctaEyebrow={ctaEyebrow}
        ctaHeadline={ctaHeadline}
      >
        {children}
      </ReducedMotionStory>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="hermes-story"
      className="relative min-h-[100svh] h-[100svh] overflow-x-hidden overflow-y-hidden bg-bg border-y border-border/30"
      aria-label={title}
    >
      <div className="absolute inset-0 pointer-events-none opacity-30 z-0 flex justify-center items-center">
        <div className="w-[80vw] h-[50vh] bg-primary/10 blur-[150px] rounded-[100%]" />
      </div>

      <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-start px-[8vw] pt-[max(1.25rem,env(safe-area-inset-top))] md:pt-10 pointer-events-none select-none gap-4">
        <span className="text-[11px] md:text-xs tracking-[0.25em] text-muted uppercase">
          — {storyKicker}
        </span>
        <span className="text-[11px] md:text-xs tracking-[0.25em] text-muted uppercase text-right">
          {scrollHint}
        </span>
      </div>

      <div
        ref={trackRef}
        className="absolute left-0 top-0 bottom-0 flex min-h-0 w-max flex-nowrap items-stretch gap-8 md:gap-12 pt-[clamp(6rem,14vw,8.5rem)] pb-6 md:pb-10 will-change-transform"
        style={{ paddingLeft: '8vw', paddingRight: '8vw' }}
      >
        <div className="pointer-events-auto flex shrink-0 w-[min(92vw,480px)] md:w-[min(40vw,520px)] max-h-full flex-col justify-center self-center pr-4 md:pr-12 min-h-0 py-2">
          <h2 className="text-hover-pop text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[0.98] tracking-tight text-text">
            {headlineTop} <br />
            <span className="text-accent">{headlineAccent}</span>
          </h2>
          <p className="mt-4 md:mt-6 text-muted text-sm md:text-base lg:text-lg max-w-md leading-relaxed">
            {subtitle}
          </p>
        </div>

        {React.Children.map(children, (child, i) => (
          <div
            key={i}
            className="pointer-events-auto flex shrink-0 w-[min(85vw,600px)] max-h-[min(420px,calc(100svh-9rem))] self-center"
          >
            <div className="min-h-0 min-w-0 w-full overflow-y-auto overscroll-y-contain scrollbar-hide rounded-2xl">
              {child}
            </div>
          </div>
        ))}

        <div className="pointer-events-auto flex shrink-0 w-[min(88vw,440px)] md:max-w-md max-h-[min(380px,calc(100svh-9rem))] flex-col justify-center self-center border-l border-border/40 pl-8 md:pl-14 overflow-y-auto scrollbar-hide min-h-0 py-2">
          <span className="text-accent text-sm font-medium mb-4 tracking-wide">{ctaEyebrow}</span>
          <p className="text-hover-pop text-3xl md:text-4xl font-bold leading-tight text-text">{ctaHeadline}</p>
        </div>
      </div>
    </section>
  );
};

export default HorizontalParallax;
