import { useState, useEffect, useRef, type ReactNode } from "react";
import { Button } from "antd";
import type { ButtonProps } from "antd";
import { cn } from "@/lib/utils";
import SparkleIconSVG from "./SparkleIconSVG";
import styles from "./AIButton.module.scss";

interface AIButtonProps extends Omit<ButtonProps, 'type' | 'variant'> {
  variant: "outline" | "hero";
  children?: ReactNode;
  type?: ButtonProps["type"]; // Re-add type as optional to avoid TS errors
  borderWidth?: string; // CSS value like "1px", "2px", etc.
  borderRadius?: string; // CSS border-radius value for outer and inner corners
}

const AIButton = (props: AIButtonProps) => {
  const {
    variant,
    className,
    children = "Summarize",
    onClick,
    onMouseEnter: userMouseEnter,
    onMouseLeave: userMouseLeave,
    borderWidth,
    borderRadius,
    size = "middle",
    ...restProps
  } = props;

  const buttonSize = size;

  const iconSize = buttonSize === "small" ? 16 : buttonSize === "large" ? 24 : 20;

  const radiusBySize: Record<NonNullable<ButtonProps["size"]>, string> = {
    small: "4px",
    middle: "6px",
    large: "8px"
  };

  const borderWidthBySize: Record<NonNullable<ButtonProps["size"]>, string> =
    variant === "hero"
      ? { small: "1px", middle: "1px", large: "1px" }
      : { small: "1px", middle: "1px", large: "1px" };

  const heightBySize: Record<NonNullable<ButtonProps["size"]>, number> = {
    small: 24,
    middle: 32,
    large: 40
  };

  const resolvedBorderRadius = borderRadius ?? radiusBySize[buttonSize];
  const resolvedBorderWidth = borderWidth ?? borderWidthBySize[buttonSize];
  const resolvedHeight = heightBySize[buttonSize];
  const parseBorderWidth = (value: string): number | null => {
    const numericMatch = value.match(/[-+]?[0-9]*\.?[0-9]+/);
    if (!numericMatch) {
      return null;
    }
    const numericValue = Number.parseFloat(numericMatch[0]);
    return Number.isFinite(numericValue) ? numericValue : null;
  };
  const borderWidthValue = parseBorderWidth(resolvedBorderWidth);
  const adjustedHeight = borderWidthValue !== null
    ? Math.max(resolvedHeight - borderWidthValue * 2, 0)
    : resolvedHeight;
  const buttonHeight = `${adjustedHeight}px`;

  const [isHovered, setIsHovered] = useState(false);
  const [gradientAngle, setGradientAngle] = useState(135);
  const animationRef = useRef<number | null>(null);
  const angleRef = useRef(gradientAngle);

  // Only hero variant uses gradient animation
  const animateGradient = variant === "hero";

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
    const duration = 600;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress =
        progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;

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

  // Style object for gradient angle (only used by rotate and hero variants)
  const angleStyle = animateGradient ? { '--ai-button-angle': `${gradientAngle}deg` } as React.CSSProperties : undefined;

  // Create style object with CSS variables for border width and radius
  const customStyle: React.CSSProperties = {
    ...angleStyle,
    '--ai-border-width': resolvedBorderWidth,
    '--ai-border-radius': resolvedBorderRadius
  } as React.CSSProperties;
  const buttonStyle: React.CSSProperties = {
    ...customStyle,
    height: buttonHeight
  };

  // Render different variants
  switch (variant) {
    case "outline":
      return (
        <div
          className={cn(
            styles["aiButtonWrapper--outline"],
            getWrapperStateClass(),
            className
          )}
          style={customStyle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Button
            type="default"
            icon={
              <div className={styles.iconWrapper}>
                {/* Black version (default state) */}
                <SparkleIconSVG
                  variant="black"
                  size={iconSize}
                  className={styles.iconBlack}
                />
                {/* Color version (hover state) */}
                <SparkleIconSVG
                  variant="color"
                  size={iconSize}
                  className={styles.iconColor}
                />
              </div>
            }
            className={cn(
              styles.aiButton,
              styles["aiButton--outline"],
              getStateClass()
            )}
            style={buttonStyle}
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
            styles["aiButtonWrapper--hero"],
            getWrapperStateClass(),
            className
          )}
          style={customStyle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Button
            type="primary"
            icon={<SparkleIconSVG variant="white" size={iconSize} />}
            className={cn(
              styles.aiButton,
              styles["aiButton--hero"],
              getStateClass()
            )}
            style={buttonStyle}
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
