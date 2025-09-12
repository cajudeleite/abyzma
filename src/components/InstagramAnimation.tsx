import React from 'react';
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
  // Use the original animation data without modification
  if (!instagramAnimationData) {
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
      <div
        style={{
          filter: strokeColor === 'white' ? 'brightness(0) invert(1)' : `brightness(0) saturate(100%) ${strokeColor}`,
          width: '100%',
          height: '100%',
        }}
      >
        <LottieAnimation
          ref={animationRef}
          animationData={instagramAnimationData}
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
