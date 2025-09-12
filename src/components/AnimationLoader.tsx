import React from 'react';
import LottieAnimation from './LottieAnimation';

interface AnimationLoaderProps {
  animationPath: string;
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

const AnimationLoader: React.FC<AnimationLoaderProps> = ({
  animationPath,
  size = 56,
  strokeColor = 'white',
  fillColor = 'white',
  className = '',
  loop = true,
  autoplay = true,
  speed = 1,
  onClick,
  onHover,
  onLeave,
}) => {
  const [animationData, setAnimationData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadAnimation = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Import the animation data dynamically
        const data = await import(animationPath);
        setAnimationData(data.default || data);
      } catch (err) {
        console.error('Failed to load animation:', err);
        setError('Failed to load animation');
      } finally {
        setLoading(false);
      }
    };

    loadAnimation();
  }, [animationPath]);

  if (loading) {
    return (
      <div 
        className={`flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
      >
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error || !animationData) {
    return (
      <div 
        className={`flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
      >
        <div className="text-red-500 text-xs">Error</div>
      </div>
    );
  }

  // Modify the animation data to use custom colors
  const modifiedAnimationData = React.useMemo(() => {
    if (!animationData) return null;
    
    // Deep clone the animation data
    const data = JSON.parse(JSON.stringify(animationData));
    
    // Update stroke colors in the animation data
    const updateColors = (obj: any) => {
      if (typeof obj !== 'object' || obj === null) return;
      
      if (obj.c && Array.isArray(obj.c) && obj.c.length >= 4) {
        // This is a color property
        const color = hexToRgb(strokeColor);
        if (color) {
          obj.c.a = 0; // alpha
          obj.c.k = [color.r / 255, color.g / 255, color.b / 255, 1]; // RGB values
        }
      }
      
      // Recursively update all properties
      Object.values(obj).forEach(updateColors);
    };
    
    updateColors(data);
    return data;
  }, [animationData, strokeColor, fillColor]);

  // Convert hex color to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  if (!modifiedAnimationData) {
    return null;
  }

  return (
    <div
      className={`cursor-pointer ${className}`}
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{
        width: size,
        height: size,
        display: 'inline-block',
      }}
    >
      <LottieAnimation
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
  );
};

export default AnimationLoader;
