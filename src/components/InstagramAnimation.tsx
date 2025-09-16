import React, { useMemo } from 'react';
import LottieAnimation from './LottieAnimation';
import { type AnimationItem } from 'lottie-web';
import instagramAnimationData from '../assets/lotties/instagram/instagram.json';

interface InstagramAnimationProps {
  size?: number;
  strokeColor?: string;
  fillColor?: string;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
  speed?: number;
  onClick?: () => void;
  onHover?: () => void;
  onLeave?: () => void;
}

// Helper function to convert hex color to RGB array
const hexToRgb = (hex: string): [number, number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    return [
      parseInt(result[1], 16) / 255,
      parseInt(result[2], 16) / 255,
      parseInt(result[3], 16) / 255,
      1
    ];
  }
  // Default to white if parsing fails
  return [1, 1, 1, 1];
};

// Helper function to modify animation data colors
const modifyAnimationColors = (data: unknown, strokeColor: string) => {
  if (!data || typeof data !== 'object' || !('layers' in data)) return data;
  
  const modifiedData = JSON.parse(JSON.stringify(data)); // Deep clone
  const rgbColor = hexToRgb(strokeColor);
  
  // Recursively find and replace stroke colors
  const replaceStrokeColors = (obj: unknown) => {
    if (typeof obj !== 'object' || obj === null) return;
    
    if ('ty' in obj && obj.ty === 'st' && 'c' in obj && obj.c && typeof obj.c === 'object' && 'k' in obj.c && Array.isArray(obj.c.k) && obj.c.k.length === 4) {
      (obj.c as { k: [number, number, number, number] }).k = rgbColor;
    }
    
    // Recursively process nested objects
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        replaceStrokeColors((obj as Record<string, unknown>)[key]);
      }
    }
  };
  
  replaceStrokeColors(modifiedData);
  return modifiedData;
};

const InstagramAnimation: React.FC<InstagramAnimationProps> = ({
  size = 56,
  strokeColor = 'white',
  fillColor = 'white', // Keep for API compatibility but not used in current implementation
  className = '',
  loop = false,
  autoplay = false,
  speed = 1,
  onClick,
  onHover,
  onLeave,
}) => {
  // Suppress unused variable warning
  void fillColor;
  const animationRef = React.useRef<AnimationItem | null>(null);
  
  // Modify animation data with the specified color
  const modifiedAnimationData = useMemo(() => {
    if (!instagramAnimationData) return null;
    return modifyAnimationColors(instagramAnimationData, strokeColor);
  }, [strokeColor]);
  
  if (!modifiedAnimationData) {
    return null;
  }

  const handleMouseEnter = () => {
    // Play animation on hover
    if (animationRef.current) {
      animationRef.current.setDirection(1); // Play forward
      animationRef.current.play();
    }
    onHover?.();
  };

  const handleMouseLeave = () => {
    // Smoothly reverse the animation
    if (animationRef.current) {
      // Get current progress
      const currentProgress = animationRef.current.currentFrame;
      
      // If we're at the beginning, just stop
      if (currentProgress <= 0) {
        animationRef.current.stop();
        return;
      }
      
      // Smoothly animate back to the beginning
      const startFrame = currentProgress;
      const endFrame = 0;
      const duration = 300; // 300ms for smooth reverse
      const startTime = Date.now();
      
      const animateReverse = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth reverse
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentFrame = startFrame + (endFrame - startFrame) * easeOut;
        
        if (animationRef.current) {
          animationRef.current.goToAndStop(currentFrame, true);
        }
        
        if (progress < 1) {
          requestAnimationFrame(animateReverse);
        } else {
          if (animationRef.current) {
            animationRef.current.stop();
          }
        }
      };
      
      requestAnimationFrame(animateReverse);
    }
    onLeave?.();
  };

  return (
    <div
      className={`cursor-pointer transition-all duration-300 ease-in-out hover:scale-110 ${className}`}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        width: size,
        height: size,
        display: 'inline-block',
      }}
    >
      <div className='h-full w-full'>
        <LottieAnimation
          ref={animationRef}
          animationData={modifiedAnimationData}
          loop={loop}
          autoplay={autoplay}
          speed={speed}
          width={size}
          height={size}
          renderer="svg"
          rendererSettings={{
            preserveAspectRatio: 'xMidYMid meet',
            progressiveLoad: true,
            hideOnTransparent: true,
          }}
        />
      </div>
    </div>
  );
};

export default InstagramAnimation;
