import { useEffect, useState, useRef } from 'react';

/**
 * Scroll-triggered visibility (IntersectionObserver). Replaces framer-motion useInView.
 * @param {Object} options
 * @param {string} [options.margin] — alias for rootMargin, e.g. '-100px'
 * @param {string} [options.rootMargin]
 * @param {boolean} [options.once=true]
 */
export const useScrollReveal = (options = {}) => {
  const {
    root = null,
    rootMargin: rm,
    margin,
    threshold = 0,
    once = true,
  } = options;

  const rootMargin = rm ?? margin ?? '-100px';

  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setIsInView(false);
        }
      },
      { root, rootMargin, threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [root, rootMargin, threshold, once]);

  return { ref, isInView };
};
