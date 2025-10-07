import { useState, useEffect, useRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import SparkleIcon from './SparkleIcon';

interface AIButtonProps {
  variant: 'rotate' | 'shimmer' | 'outline' | 'combined';
  children?: ReactNode;
  onClick?: () => void;
  className?: string;
}

const AIButton = ({ variant, children = 'Summarize', onClick, className }: AIButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [gradientAngle, setGradientAngle] = useState(135);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (variant !== 'rotate' && variant !== 'combined') return;

    const targetAngle = isHovered ? 315 : 135;
    const startAngle = gradientAngle;
    const startTime = Date.now();
    const duration = 600;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeProgress = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      
      const currentAngle = startAngle + (targetAngle - startAngle) * easeProgress;
      setGradientAngle(currentAngle);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isHovered, variant]);

  const baseClasses = "flex px-4 py-2 items-center gap-2 rounded border cursor-pointer font-medium text-sm transition-all duration-300 relative";

  if (variant === 'rotate') {
    return (
      <button
        className={cn(baseClasses, "text-primary-foreground shadow-lg", className)}
        style={{
          background: `linear-gradient(${gradientAngle}deg, hsl(207 70% 63%) 0%, hsl(18 72% 61%) 100%)`,
          filter: isHovered ? 'saturate(1.5) brightness(1.15)' : 'saturate(1) brightness(1)',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
      >
        <SparkleIcon fill="white" />
        <span>{children}</span>
      </button>
    );
  }

  if (variant === 'shimmer') {
    return (
      <button
        className={cn(baseClasses, "text-primary-foreground shadow-lg overflow-hidden", className)}
        style={{
          background: 'linear-gradient(135deg, hsl(207 70% 63%) 0%, hsl(18 72% 61%) 100%)',
          filter: isHovered ? 'saturate(1.5) brightness(1.15)' : 'saturate(1) brightness(1)',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
            left: isHovered ? '100%' : '-100%',
            transition: 'left 0.8s ease',
          }}
        />
        <SparkleIcon fill="white" className="relative z-10" />
        <span className="relative z-10">{children}</span>
      </button>
    );
  }

  if (variant === 'outline') {
    return (
      <div
        className={cn("p-[2px] rounded transition-all duration-300", className)}
        style={{
          background: 'linear-gradient(135deg, hsl(207 70% 63%) 0%, hsl(18 72% 61%) 100%)',
          filter: isHovered ? 'saturate(1.5) brightness(1.15)' : 'saturate(1) brightness(1)',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button
          className={cn(baseClasses, "bg-card border-none shadow-none font-semibold")}
          style={{
            color: isHovered ? 'hsl(207 70% 63%)' : 'hsl(0 0% 16%)',
            transition: 'color 0.3s ease',
          }}
          onClick={onClick}
        >
          <SparkleIcon 
            fill={isHovered ? 'hsl(207 70% 63%)' : 'hsl(0 0% 16%)'} 
            className="transition-colors duration-300"
          />
          <span>{children}</span>
        </button>
      </div>
    );
  }

  if (variant === 'combined') {
    const borderGradient = isHovered 
      ? `linear-gradient(${gradientAngle}deg, hsl(207 65% 58%) 24.61%, hsl(18 67% 56%) 75.39%)`
      : `linear-gradient(${gradientAngle}deg, hsl(207 60% 54%) 24.61%, hsl(18 62% 52%) 75.39%)`;
    
    const bgGradient = isHovered 
      ? `linear-gradient(${gradientAngle}deg, hsl(207 85% 68%) 24.61%, hsl(18 77% 66%) 75.39%)`
      : `linear-gradient(${gradientAngle}deg, hsl(207 75% 64%) 24.61%, hsl(18 72% 61%) 75.39%)`;

    return (
      <div
        className={cn("p-[2px] rounded transition-all duration-300", className)}
        style={{
          background: borderGradient,
          filter: isHovered 
            ? 'drop-shadow(3px 3px 6px rgba(90, 184, 255, 0.35)) drop-shadow(3px 3px 6px rgba(255, 158, 120, 0.35))' 
            : 'drop-shadow(3px 3px 6px rgba(68, 163, 255, 0.25)) drop-shadow(3px 3px 6px rgba(255, 134, 87, 0.25))',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button
          className={cn(baseClasses, "text-primary-foreground border-none shadow-none")}
          style={{
            background: bgGradient,
          }}
          onClick={onClick}
        >
          <SparkleIcon fill="white" />
          <span>{children}</span>
        </button>
      </div>
    );
  }

  return null;
};

export default AIButton;
