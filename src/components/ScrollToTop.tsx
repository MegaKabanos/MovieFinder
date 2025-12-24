import { useState, useEffect } from 'react';
import Arrow from '../assets/arrow';

interface ScrollToTopProps {
  duration?: number; // Animation duration in milliseconds
}

const ScrollToTop = ({ duration = 800 }: ScrollToTopProps) => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Smooth scroll to top with custom animation
  const scrollToTop = () => {
    const startPosition = window.scrollY;
    const startTime = performance.now();

    const easeInOutCubic = (t: number): number => {
      return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = easeInOutCubic(progress);

      window.scrollTo(0, startPosition * (1 - easeProgress));

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  return (
    <button
      onClick={scrollToTop}
      className={`
        group fixed bottom-2 right-2 sm:bottom-5 sm:right-5  z-50
        bg-(--color-secondary) hover:text-white
        w-9 h-9
        md:w-12 md:h-12 rounded-full shadow-lg
        flex items-center justify-center
        transition-all duration-150
        hover:scale-110
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}
      `}
      aria-label="Scroll to top"
    >
      <Arrow className="h-4 w-4 md:h-6 md:w-6 rotate-270 text-(--color-icon) group-hover:text-white transition-all duration-150" />
    </button>
  );
};

export default ScrollToTop;
