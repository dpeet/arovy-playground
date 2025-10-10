import { useState, useEffect, useRef, type ReactNode } from "react";
import { Button } from "antd";
import type { ButtonProps } from "antd";
import { cn } from "@/lib/utils";
import AISparkleIcon from "./AISparkleIcon";
import styles from "./AIButton.module.scss";

interface AIButtonProps extends Omit<ButtonProps, 'type' | 'variant'> {
  variant: "rotate" | "shimmer" | "outline" | "combined";
  children?: ReactNode;
  type?: ButtonProps["type"]; // Re-add type as optional to avoid TS errors
  gradientIntensity?: number; // 0-1, controls gradient vibrancy
  borderWidth?: string; // CSS value like "1px", "2px", etc.
}

const AIButton = (props: AIButtonProps) => {
  const {
    variant,
    className,
    children = "Summarize",
    onClick,
    onMouseEnter: userMouseEnter,
    onMouseLeave: userMouseLeave,
    gradientIntensity,
    borderWidth,
    ...restProps
  } = props;

  const [isHovered, setIsHovered] = useState(false);
  const [gradientAngle, setGradientAngle] = useState(135);
  const animationRef = useRef<number | null>(null);
  const angleRef = useRef(gradientAngle);

  // Determine if this variant uses gradient animation
  const animateGradient = variant === "rotate" || variant === "combined";

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

  // Style object for gradient angle (only used by rotate and combined variants)
  const angleStyle = animateGradient ? { '--ai-button-angle': `${gradientAngle}deg` } as React.CSSProperties : undefined;

  // Create style object with CSS variables for intensity and border width
  const customStyle: React.CSSProperties = {
    ...angleStyle,
    ...(gradientIntensity !== undefined && { '--ai-gradient-intensity': gradientIntensity }),
    ...(borderWidth !== undefined && { '--ai-border-width': borderWidth }),
  } as React.CSSProperties;

  // Render different variants
  switch (variant) {
    case "rotate":
      return (
        <Button
          type="primary"
          icon={<AISparkleIcon variant="black" size={20} />}
          className={cn(
            styles.aiButton,
            styles["aiButton--rotate"],
            getStateClass(),
            className
          )}
          style={customStyle}
          onClick={onClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          {...restProps}
        >
          {children}
        </Button>
      );

    case "shimmer":
      return (
        <Button
          type="primary"
          icon={<AISparkleIcon variant="black" size={20} />}
          className={cn(
            styles.aiButton,
            styles["aiButton--shimmer"],
            getStateClass(),
            className
          )}
          style={customStyle}
          onClick={onClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          {...restProps}
        >
          <div className={styles.aiButton__overlay} />
          {children}
        </Button>
      );

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
              <AISparkleIcon
                variant="color"
                size={20}
                className={styles["aiButton__icon--outline"]}
              />
            }
            className={cn(
              styles.aiButton,
              styles["aiButton--outline"],
              getStateClass()
            )}
            style={customStyle}
            onClick={onClick}
            {...restProps}
          >
            {children}
          </Button>
        </div>
      );

    case "combined":
      return (
        <div
          className={cn(
            styles["aiButtonWrapper--combined"],
            getWrapperStateClass(),
            className
          )}
          style={customStyle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Button
            type="primary"
            icon={<AISparkleIcon variant="black" size={20} />}
            className={cn(
              styles.aiButton,
              styles["aiButton--combined"],
              getStateClass()
            )}
            style={customStyle}
            onClick={onClick}
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
