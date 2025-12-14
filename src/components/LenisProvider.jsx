import { createContext, useContext, useEffect, useRef, useState } from "react";
import Lenis from "lenis";

const LenisContext = createContext(null);

export const useLenis = () => {
  // Return the Lenis context directly. It may be null during initial mount
  // while the Lenis instance is being initialized inside the provider.
  return useContext(LenisContext);
};

export const LenisProvider = ({ children }) => {
  const lenisRef = useRef(null);
  const [lenis, setLenis] = useState(null);

  useEffect(() => {
    // Initialize Lenis with optimal settings
    const lenisInstance = new Lenis({
      duration: 1.2, // Smooth scroll duration
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing function
      direction: "vertical", // Scroll direction
      gestureDirection: "vertical", // Gesture direction
      smooth: true, // Enable smooth scrolling
      mouseMultiplier: 1, // Mouse scroll multiplier
      smoothTouch: false, // Disable smooth scrolling on touch devices
      touchMultiplier: 2, // Touch scroll multiplier
      infinite: false, // Disable infinite scrolling
      normalizeWheel: true, // Normalize wheel delta across browsers
      wheelMultiplier: 1, // Wheel scroll multiplier
      touchInertia: true, // Enable touch inertia
    });

    lenisRef.current = lenisInstance;
    setLenis(lenisInstance);

    // Animation frame loop for smooth scrolling
    function raf(time) {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Cleanup function
    return () => {
      lenisInstance.destroy();
    };
  }, []);

  return (
    <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
  );
};

// Custom hook for scroll-triggered animations
export const useScrollAnimation = (callback, dependencies = []) => {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    // Add scroll listener
    lenis.on("scroll", callback);

    // Cleanup
    return () => {
      if (lenis && typeof lenis.off === "function") {
        lenis.off("scroll", callback);
      }
    };
  }, [lenis, callback, ...dependencies]);
};

// Hook for scrolling to elements
export const useScrollTo = () => {
  const lenis = useLenis();

  const scrollTo = (target, options = {}) => {
    if (!lenis) return;

    const defaultOptions = {
      offset: 0,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      ...options,
    };

    lenis.scrollTo(target, defaultOptions);
  };

  const scrollToTop = (options = {}) => {
    scrollTo(0, options);
  };

  return { scrollTo, scrollToTop };
};

// Safe scroll animation hook that doesn't require Lenis to be initialized
export const useSafeScrollAnimation = (callback, dependencies = []) => {
  const lenisContext = useContext(LenisContext);

  useEffect(() => {
    if (!lenisContext) return;

    // Add scroll listener
    lenisContext.on("scroll", callback);

    // Cleanup
    return () => {
      if (lenisContext && typeof lenisContext.off === "function") {
        lenisContext.off("scroll", callback);
      }
    };
  }, [lenisContext, callback, ...dependencies]);
};

export default LenisProvider;
