import { useState, useEffect } from 'react';

export function validateScreen(threshold = 768) {
  try {
    const [isMobile, setIsMobile] = useState(window.innerWidth < threshold);

    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth < threshold);
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, [threshold]);

    return isMobile;
  } catch (error) {
    console.error('Ha ocurrido un error ejecutando validate screen.');
  }
}
