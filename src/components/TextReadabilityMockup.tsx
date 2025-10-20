import React, { useState, useRef, useEffect } from 'react';
import SparkleIconSVG from './SparkleIconSVG';
import styles from './TextReadabilityMockup.module.scss';

interface GradientColors {
  idle: { start: string; end: string };
  hover: { start: string; end: string };
}

interface TextReadabilityMockupProps {
  variant: 'overlay' | 'text-shadow' | 'darker-gradient' | 'bold-text' | 'reduced-lightness' | 'lighter-gradient';
  label: string;
  description: string;
}

const GRADIENT_CONFIGS: Record<string, GradientColors> = {
  current: {
    idle: { start: '#6EB8FF', end: '#FF9E78' },
    hover: { start: '#88C7FF', end: '#FFB598' }
  },
  darker: {
    idle: { start: '#3B7FC9', end: '#D96A47' },
    hover: { start: '#5193DC', end: '#E67F5E' }
  },
  reduced: {
    idle: { start: '#4A8FD4', end: '#E87457' },
    hover: { start: '#619FE0', end: '#F28666' }
  },
  lighter: {
    idle: { start: '#A3D4FF', end: '#FFC9B5' },
    hover: { start: '#B8DEFF', end: '#FFD8C8' }
  }
};

export const TextReadabilityMockup: React.FC<TextReadabilityMockupProps> = ({
  variant,
  label,
  description
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [gradientAngle, setGradientAngle] = useState(135);
  const animationRef = useRef<number | null>(null);
  const angleRef = useRef(135);

  // Easing function
  const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

  useEffect(() => {
    if (isHovered) {
      const startAngle = angleRef.current;
      const targetAngle = 315;
      const startTime = performance.now();
      const duration = 600;

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutCubic(progress);
        const newAngle = startAngle + (targetAngle - startAngle) * easedProgress;

        angleRef.current = newAngle;
        setGradientAngle(newAngle);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      const startAngle = angleRef.current;
      const targetAngle = 135;
      const startTime = performance.now();
      const duration = 600;

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutCubic(progress);
        const newAngle = startAngle + (targetAngle - startAngle) * easedProgress;

        angleRef.current = newAngle;
        setGradientAngle(newAngle);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isHovered]);

  const getGradientConfig = () => {
    switch (variant) {
      case 'darker-gradient':
        return GRADIENT_CONFIGS.darker;
      case 'reduced-lightness':
        return GRADIENT_CONFIGS.reduced;
      case 'lighter-gradient':
        return GRADIENT_CONFIGS.lighter;
      default:
        return GRADIENT_CONFIGS.current;
    }
  };

  const gradientConfig = getGradientConfig();
  const colors = isHovered ? gradientConfig.hover : gradientConfig.idle;

  const getTextColor = () => {
    if (variant === 'darker-gradient') return '#FFFFFF';
    return '#000000';
  };

  const getFontWeight = () => {
    if (variant === 'bold-text') return 600;
    return 500;
  };

  const getTextShadow = () => {
    if (variant === 'text-shadow') return '0 1px 3px rgba(0, 0, 0, 0.4)';
    return undefined;
  };

  const hasOverlay = variant === 'overlay';

  const buttonStyle: React.CSSProperties = {
    '--gradient-angle': `${gradientAngle}deg`,
    '--gradient-start': colors.start,
    '--gradient-end': colors.end,
  } as React.CSSProperties;

  const contentStyle: React.CSSProperties = {
    color: getTextColor(),
    fontWeight: getFontWeight(),
    textShadow: getTextShadow(),
  };

  return (
    <div className={styles.mockupContainer}>
      <div className={styles.buttonWrapper}>
        <div
          className={`${styles.mockupButton} ${isHovered ? styles.hovered : ''}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={buttonStyle}
        >
          <div className={styles.borderLayer}>
            <div 
              className={styles.gradient}
              style={{
                background: `linear-gradient(var(--gradient-angle), var(--gradient-start), var(--gradient-end))`
              }}
            />
          </div>
          {hasOverlay && <div className={styles.overlay} />}
          <button className={styles.innerButton} style={contentStyle}>
            <SparkleIconSVG />
            <span>Generate with AI</span>
          </button>
        </div>
      </div>
      <div className={styles.info}>
        <div className={styles.label}>{label}</div>
        <div className={styles.description}>{description}</div>
      </div>
    </div>
  );
};
