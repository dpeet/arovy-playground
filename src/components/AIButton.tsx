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
  // Store angle in ref to access current value during animation without re-triggering effect
  const angleRef = useRef(gradientAngle);

  // Both variants need JavaScript animation because CSS cannot smoothly transition gradient angles
  // even with @property registration - we need requestAnimationFrame for smooth interpolation
  const animateGradient = true;

  // Keep angleRef in sync with state for animation continuity (prevents jumps when reversing mid-animation)
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
      // Use easeOutCubic for smooth, pleasant motion feel (fast start, gentle landing)
      // This creates a more responsive feel than linear while avoiding abrupt stops
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

  // Compose hover handlers to preserve user's callbacks while managing internal animation state
  // This allows parent components to attach their own hover logic without breaking our animations
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

  // Shared CSS variables keep border layer, button content, and sizing perfectly synchronized
  // Using CSS variables allows the animated angle to update both layers simultaneously
  const sharedStyle = {
    '--ai-border-width': resolvedBorderWidth,
    '--ai-border-radius': resolvedBorderRadius,
    '--ai-button-height': `${resolvedHeight}px`,
    '--ai-padding-inline': resolvedPaddingInline,
    '--ai-padding-block': resolvedPaddingBlock,
    '--ai-button-angle': `${gradientAngle}deg`,
  } as CSSProperties;

  // Render different variants using separate-layer architecture
  // Both variants use: wrapper (positioning) → border layer (effects) → button (content)
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
          {/* Border layer: absolute positioned sibling with gradient + filter (saturate/brightness)
              z-index: 1 (behind button), pointer-events: none (clicks pass through)
              Filter affects ONLY this layer, keeping button content sharp */}
          <div
            className={cn(
              styles.aiButtonBorder,
              styles["aiButtonBorder--hero-outline"],
              getStateClass()
            )}
            style={sharedStyle}
            aria-hidden="true"
          />

          {/* Button layer: relative positioned with margin inset to reveal border
              z-index: 2 (above border), no filter (clean text and icon rendering) */}
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
          {/* Border layer: absolute positioned sibling with darker gradient + drop-shadow glow
              z-index: 1 (behind button), pointer-events: none (clicks pass through)
              Drop-shadow filter affects ONLY this layer, creating glow without blurring text */}
          <div
            className={cn(
              styles.aiButtonBorder,
              styles["aiButtonBorder--hero"],
              getStateClass()
            )}
            style={sharedStyle}
            aria-hidden="true"
          />

          {/* Button layer: relative positioned with gradient fill, margin inset reveals border
              z-index: 2 (above border), gradient rotates in sync with border gradient */}
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
