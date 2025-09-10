import React, { useEffect, useRef } from "react";

interface FuzzyImageProps {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  enableHover?: boolean;
  baseIntensity?: number;
  hoverIntensity?: number;
}

const FuzzyImage: React.FC<FuzzyImageProps> = ({
  src,
  alt = "",
  width,
  height,
  enableHover = true,
  baseIntensity = 0.18,
  hoverIntensity = 0.5
}) => {
  const canvasRef = useRef<HTMLCanvasElement & { cleanupFuzzyImage?: () => void }>(null);

  useEffect(() => {
    let animationFrameId: number;
    let isCancelled = false;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const img = new Image();
    img.src = src;

    img.onload = () => {
      if (isCancelled) return;

      const finalWidth = width || img.width;
      const finalHeight = height || img.height;

      canvas.width = finalWidth;
      canvas.height = finalHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Criar um canvas offscreen para copiar a imagem original
      const offscreen = document.createElement("canvas");
      offscreen.width = finalWidth;
      offscreen.height = finalHeight;
      const offCtx = offscreen.getContext("2d");
      if (!offCtx) return;
      offCtx.drawImage(img, 0, 0, finalWidth, finalHeight);

      let isHovering = false;
      const fuzzRange = 30;

      const run = () => {
        if (isCancelled) return;
        ctx.clearRect(-fuzzRange, -fuzzRange, finalWidth + 2 * fuzzRange, finalHeight + 2 * fuzzRange);
        const intensity = isHovering ? hoverIntensity : baseIntensity;

        // Fazemos o mesmo "slice horizontal" linha a linha
        for (let j = 0; j < finalHeight; j++) {
          const dx = Math.floor(intensity * (Math.random() - 0.5) * fuzzRange);
          ctx.drawImage(offscreen, 0, j, finalWidth, 1, dx, j, finalWidth, 1);
        }
        animationFrameId = window.requestAnimationFrame(run);
      };

      run();

      const isInsideImage = (x: number, y: number) =>
        x >= 0 && x <= finalWidth && y >= 0 && y <= finalHeight;

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

      const cleanup = () => {
        window.cancelAnimationFrame(animationFrameId);
        if (enableHover) {
          canvas.removeEventListener("mousemove", handleMouseMove);
          canvas.removeEventListener("mouseleave", handleMouseLeave);
          canvas.removeEventListener("touchmove", handleTouchMove);
          canvas.removeEventListener("touchend", handleTouchEnd);
        }
      };

      canvas.cleanupFuzzyImage = cleanup;
    };

    return () => {
      isCancelled = true;
      window.cancelAnimationFrame(animationFrameId);
      if (canvas && canvas.cleanupFuzzyImage) {
        canvas.cleanupFuzzyImage();
      }
    };
  }, [src, width, height, enableHover, baseIntensity, hoverIntensity]);

  return <canvas ref={canvasRef} aria-label={alt} />;
};

export default FuzzyImage;
