import React, { useEffect, useRef } from "react";

interface FuzzyImageProps {
  src: string;
  alt?: string;
  className?: string; // <-- para usar w-full, max-w-lg etc.
  enableHover?: boolean;
  baseIntensity?: number;
  hoverIntensity?: number;
}

const FuzzyImage: React.FC<FuzzyImageProps> = ({
  src,
  alt = "",
  className = "w-full h-auto", // padrão responsivo
  enableHover = true,
  baseIntensity = 0.18,
  hoverIntensity = 0.5,
}) => {
  const canvasRef = useRef<HTMLCanvasElement & { cleanupFuzzyImage?: () => void }>(null);

  useEffect(() => {
    let animationFrameId: number;
    let isCancelled = false;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const img = new Image();
    img.src = src;

    const renderFuzzyImage = (width: number, height: number) => {
      if (isCancelled) return;

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const offscreen = document.createElement("canvas");
      offscreen.width = width;
      offscreen.height = height;
      const offCtx = offscreen.getContext("2d");
      if (!offCtx) return;
      offCtx.drawImage(img, 0, 0, width, height);

      let isHovering = false;
      const fuzzRange = Math.max(width * 0.02, 5);

      const run = () => {
        if (isCancelled) return;
        ctx.clearRect(-fuzzRange, -fuzzRange, width + 2 * fuzzRange, height + 2 * fuzzRange);
        const intensity = isHovering ? hoverIntensity : baseIntensity;

        for (let j = 0; j < height; j++) {
          const dx = Math.floor(intensity * (Math.random() - 0.5) * fuzzRange);
          ctx.drawImage(offscreen, 0, j, width, 1, dx, j, width, 1);
        }
        animationFrameId = window.requestAnimationFrame(run);
      };

      run();

      const isInsideImage = (x: number, y: number) => x >= 0 && x <= width && y >= 0 && y <= height;

      const handleMouseMove = (e: MouseEvent) => {
        if (!enableHover) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        isHovering = isInsideImage(x, y);
      };

      const handleMouseLeave = () => {
        isHovering = false;
      };

      const handleTouchMove = (e: TouchEvent) => {
        if (!enableHover) return;
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        isHovering = isInsideImage(x, y);
      };

      const handleTouchEnd = () => {
        isHovering = false;
      };

      if (enableHover) {
        canvas.addEventListener("mousemove", handleMouseMove);
        canvas.addEventListener("mouseleave", handleMouseLeave);
        canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
        canvas.addEventListener("touchend", handleTouchEnd);
      }

      canvas.cleanupFuzzyImage = () => {
        window.cancelAnimationFrame(animationFrameId);
        if (enableHover) {
          canvas.removeEventListener("mousemove", handleMouseMove);
          canvas.removeEventListener("mouseleave", handleMouseLeave);
          canvas.removeEventListener("touchmove", handleTouchMove);
          canvas.removeEventListener("touchend", handleTouchEnd);
        }
      };
    };

    img.onload = () => {
      // Usa ResizeObserver para manter o canvas responsivo
      const resizeObserver = new ResizeObserver(() => {
        const parentWidth = canvas.parentElement?.clientWidth || img.width;
        const aspectRatio = img.width / img.height;
        const newWidth = parentWidth;
        const newHeight = newWidth / aspectRatio;
        renderFuzzyImage(newWidth, newHeight);
      });

      resizeObserver.observe(canvas.parentElement || canvas);

      // cleanup observer
      canvas.cleanupFuzzyImage = () => {
        resizeObserver.disconnect();
      };
    };

    return () => {
      isCancelled = true;
      window.cancelAnimationFrame(animationFrameId);
      if (canvas && canvas.cleanupFuzzyImage) {
        canvas.cleanupFuzzyImage();
      }
    };
  }, [src, enableHover, baseIntensity, hoverIntensity]);

  return <canvas ref={canvasRef} className={className} aria-label={alt} />;
};

export default FuzzyImage;
