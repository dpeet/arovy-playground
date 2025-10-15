import { useState, useEffect, useRef, type ReactNode, type CSSProperties } from "react";
import { Button } from "antd";
import type { ButtonProps } from "antd";
import { cn } from "@/lib/utils";
import { easeOutCubic, easeInCubic } from "@/lib/easing";
import SparkleIconSVG from "./SparkleIconSVG";
import styles from "./AIButton.module.scss";

const radiusBySize = {
  small: "4px",
  middle: "6px",
  large: "8px",
} as const;

const borderWidthBySize = {
  small: "1px",
  middle: "1px",
  large: "1px",
} as const;

const heightBySize = {
  small: 24,
  middle: 32,
  large: 40,
} as const;

const paddingInlineBySize = {
  small: "7px",
  middle: "15px",
  large: "19px",
} as const;

const paddingBlockBySize = {
  small: "2px",
  middle: "4px",
  large: "7px",
} as const;

interface AIButtonProps extends Omit<ButtonProps, 'type' | 'variant'> {
  variant: "hero-outline" | "hero";
  children?: ReactNode;
  type?: ButtonProps["type"]; // Re-add type as optional to avoid TS errors
}

const AIButton = (props: AIButtonProps) => {
  const {
    variant,
    className,
    children = "Summarize",
    onClick,
    onMouseEnter: userMouseEnter,
    onMouseLeave: userMouseLeave,
    size = "middle",
    ...restProps
  } = props;

  const buttonSize = size ?? "middle";
  const iconSize = buttonSize === "small" ? 16 : buttonSize === "large" ? 24 : 20;
  const resolvedBorderRadius = radiusBySize[buttonSize];
  const resolvedBorderWidth = borderWidthBySize[buttonSize];
  const resolvedHeight = heightBySize[buttonSize];
  const resolvedPaddingInline = paddingInlineBySize[buttonSize];
  const resolvedPaddingBlock = paddingBlockBySize[buttonSize];

  const [isHovered, setIsHovered] = useState(false);
  const [gradientAngle, setGradientAngle] = useState(135);
  const animationRef = useRef<number | null>(null);
  const angleRef = useRef(gradientAngle);

  // Both hero and hero-outline variants use gradient animation
  const animateGradient = true;

  useEffect(() => {
    angleRef.current = gradientAngle;
  }, [gradientAngle]);

  useEffect(() => {
    if (!animateGradient) {
      setGradientAngle(135);
      return;
    }

    const startAngle = angleRef.current;
    const targetAngle = isHovered ? 315 : 135;
    const startTime = Date.now();
    const duration = 300;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Use easeOutCubic when entering (fast start, slow landing)
      // Use easeInCubic when exiting (slow start, fast exit)
      const easingFn = isHovered ? easeOutCubic : easeOutCubic;
      const easeProgress = easingFn(progress);

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
  }, [animateGradient, isHovered]);

  // Compose hover handlers to preserve both internal state and user callbacks
  const handleMouseEnter: ButtonProps["onMouseEnter"] = (event) => {
    setIsHovered(true);
    userMouseEnter?.(event);
  };

  const handleMouseLeave: ButtonProps["onMouseLeave"] = (event) => {
    setIsHovered(false);
    userMouseLeave?.(event);
  };

  // Helper to generate state classes
  const getStateClass = () => isHovered ? styles["aiButton--hovered"] : styles["aiButton--idle"];
  const getWrapperStateClass = () => isHovered ? styles["aiButtonWrapper--hovered"] : styles["aiButtonWrapper--idle"];

  // Shared CSS variables keep wrapper/button sizing and gradients in sync
  const sharedStyle = {
    '--ai-border-width': resolvedBorderWidth,
    '--ai-border-radius': resolvedBorderRadius,
    '--ai-button-height': `${resolvedHeight}px`,
    '--ai-padding-inline': resolvedPaddingInline,
    '--ai-padding-block': resolvedPaddingBlock,
    '--ai-button-angle': `${gradientAngle}deg`,
  } as CSSProperties;

  // Render different variants
  switch (variant) {
    case "hero-outline":
      return (
        <div
          className={cn(
            styles.aiButtonWrapper,
            styles["aiButtonWrapper--hero-outline"],
            getWrapperStateClass(),
            className
          )}
          style={sharedStyle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Border layer with filter - separate from content */}
          <div
            className={cn(
              styles.aiButtonBorder,
              styles["aiButtonBorder--hero-outline"],
              getStateClass()
            )}
            style={sharedStyle}
            aria-hidden="true"
          />

          {/* Content layer without filter */}
          <Button
            type="default"
            icon={
              <SparkleIconSVG
                variant="custom"
                size={iconSize}
                className={styles.sparkleIcon} // Required for SCSS icon color transitions
              />
            }
            className={cn(
              styles.aiButton,
              styles["aiButton--hero-outline"],
              getStateClass()
            )}
            style={sharedStyle}
            onClick={onClick}
            size={buttonSize}
            {...restProps}
          >
            {children}
          </Button>
        </div>
      );

    case "hero":
      return (
        <div
          className={cn(
            styles.aiButtonWrapper,
            styles["aiButtonWrapper--hero"],
            getWrapperStateClass(),
            className
          )}
          style={sharedStyle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Button
            type="primary"
            icon={
              <SparkleIconSVG
                variant="black"
                size={iconSize}
                className={styles.sparkleIcon} // Required for SCSS icon color transitions
              />
            }
            className={cn(
              styles.aiButton,
              styles["aiButton--hero"],
              getStateClass()
            )}
            style={sharedStyle}
            onClick={onClick}
            size={buttonSize}
            {...restProps}
          >
            {children}
          </Button>
        </div>
      );

    default:
      return null;
  }
};

export default AIButton;
