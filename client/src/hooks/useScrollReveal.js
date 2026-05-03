import { useInView } from 'framer-motion';
import { useRef } from 'react';

/**
 * A reusable hook for scroll-triggered animations.
 * @param {Object} options - Framer Motion useInView options
 * @returns {Object} { ref, controls, variants }
 */
export const useScrollReveal = (options = { once: true, margin: "-100px" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, options);

  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1], // Custom spring-like easing
      }
    },
    hiddenLeft: { opacity: 0, x: -50 },
    visibleLeft: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    },
    hiddenRight: { opacity: 0, x: 50 },
    visibleRight: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    },
    hiddenScale: { opacity: 0, scale: 0.9 },
    visibleScale: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return { ref, isInView, variants };
};
