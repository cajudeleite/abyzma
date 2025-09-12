import React, { useEffect, useRef } from 'react';
import lottie, { type AnimationItem } from 'lottie-web';

interface LottieAnimationProps {
  animationData: unknown;
  loop?: boolean;
  autoplay?: boolean;
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
  onComplete?: () => void;
  onLoopComplete?: () => void;
  onEnterFrame?: () => void;
  speed?: number;
  direction?: 1 | -1;
  playSegments?: [number, number];
  renderer?: 'svg' | 'canvas' | 'html';
  rendererSettings?: {
    preserveAspectRatio?: string;
    progressiveLoad?: boolean;
    hideOnTransparent?: boolean;
    className?: string;
  };
}

const LottieAnimation = React.forwardRef<AnimationItem | null, LottieAnimationProps>(({
  animationData,
  loop = true,
  autoplay = true,
  width = '100%',
  height = '100%',
  className = '',
  style = {},
  onComplete,
  onLoopComplete,
  onEnterFrame,
  speed = 1,
  direction = 1,
  playSegments,
  renderer = 'svg',
  rendererSettings = {
    preserveAspectRatio: 'xMidYMid meet',
    progressiveLoad: true,
    hideOnTransparent: true,
  },
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationItem | null>(null);

  useEffect(() => {
    if (!containerRef.current || !animationData) return;

    // Clean up previous animation
    if (animationRef.current) {
      animationRef.current.destroy();
    }

    // Create new animation
    const animation = lottie.loadAnimation({
      container: containerRef.current,
      renderer,
      loop,
      autoplay,
      animationData,
      rendererSettings,
    });

    // Set speed and direction
    animation.setSpeed(speed);
    animation.setDirection(direction);

    // Set play segments if provided
    if (playSegments) {
      animation.playSegments(playSegments, true);
    }

    // Add event listeners
    if (onComplete) {
      animation.addEventListener('complete', onComplete);
    }
    if (onLoopComplete) {
      animation.addEventListener('loopComplete', onLoopComplete);
    }
    if (onEnterFrame) {
      animation.addEventListener('enterFrame', onEnterFrame);
    }

    animationRef.current = animation;

    // Expose animation via ref
    if (ref) {
      if (typeof ref === 'function') {
        ref(animation);
      } else {
        ref.current = animation;
      }
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.destroy();
        animationRef.current = null;
      }
    };
  }, [animationData, loop, autoplay, speed, direction, playSegments, renderer, rendererSettings, onComplete, onLoopComplete, onEnterFrame, ref]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width,
        height,
        ...style,
      }}
    />
  );
});

LottieAnimation.displayName = 'LottieAnimation';

export default LottieAnimation;
