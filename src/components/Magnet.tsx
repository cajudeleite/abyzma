import React, { useState, useEffect, useRef, type ReactNode, type HTMLAttributes } from 'react';

interface MagnetProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: number;
  disabled?: boolean;
  magnetStrength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  wrapperClassName?: string;
  innerClassName?: string;
}

// Throttle function to limit how often the mouse move handler runs
const throttle = (func: (e: MouseEvent) => void, limit: number) => {
  let inThrottle: boolean;
  return (e: MouseEvent) => {
    if (!inThrottle) {
      func(e);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

const Magnet: React.FC<MagnetProps> = ({
  children,
  padding = 100,
  disabled = false,
  magnetStrength = 2,
  activeTransition = 'transform 0.3s ease-out',
  inactiveTransition = 'transform 0.5s ease-in-out',
  wrapperClassName = '',
  innerClassName = '',
  ...props
}) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const magnetRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastPositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Throttled version of the mouse move handler
  const throttledMouseMove = throttle((e: MouseEvent) => {
    if (!magnetRef.current || disabled) return;

    // Cancel previous animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Use requestAnimationFrame for smooth updates
    animationFrameRef.current = requestAnimationFrame(() => {
      if (!magnetRef.current) return;

      const { left, top, width, height } = magnetRef.current.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;

      const distX = Math.abs(centerX - e.clientX);
      const distY = Math.abs(centerY - e.clientY);

      if (distX < width / 2 + padding && distY < height / 2 + padding) {
        const offsetX = (e.clientX - centerX) / magnetStrength;
        const offsetY = (e.clientY - centerY) / magnetStrength;
        
        // Only update if position has changed significantly (reduce micro-updates)
        const threshold = 0.5;
        if (Math.abs(offsetX - lastPositionRef.current.x) > threshold || 
            Math.abs(offsetY - lastPositionRef.current.y) > threshold) {
          setIsActive(true);
          setPosition({ x: offsetX, y: offsetY });
          lastPositionRef.current = { x: offsetX, y: offsetY };
        }
      } else {
        if (isActive) {
          setIsActive(false);
          setPosition({ x: 0, y: 0 });
          lastPositionRef.current = { x: 0, y: 0 };
        }
      }
    });
  }, 16); // ~60fps

  useEffect(() => {
    if (disabled) {
      setPosition({ x: 0, y: 0 });
      setIsActive(false);
      return;
    }

    window.addEventListener('mousemove', throttledMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', throttledMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [disabled, throttledMouseMove]);

  const transitionStyle = isActive ? activeTransition : inactiveTransition;

  return (
    <div
      ref={magnetRef}
      className={wrapperClassName}
      style={{ position: 'relative', display: 'inline-block' }}
      {...props}
    >
      <div
        className={innerClassName}
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          transition: transitionStyle,
          willChange: 'transform'
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Magnet;
