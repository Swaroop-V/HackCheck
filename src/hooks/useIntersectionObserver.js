// In /src/hooks/useIntersectionObserver.js

import { useEffect, useRef, useState } from 'react';

const useIntersectionObserver = (options) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    // THIS IS THE FIX: We copy the ref's current value to a variable inside the effect.
    const element = elementRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      options
    );

    if (element) {
      observer.observe(element);
    }

    // The cleanup function now uses the stable 'element' variable.
    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [options]); // The dependency array is now correct.

  return [elementRef, isIntersecting];
};

export default useIntersectionObserver;