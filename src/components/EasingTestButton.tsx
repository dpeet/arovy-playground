import { useState, useEffect, useRef, type CSSProperties } from "react";
import { Button } from "antd";
import type { ButtonProps } from "antd";
import { cn } from "@/lib/utils";
import type { EasingFunction } from "@/lib/easing";
import { easeInCubic } from "@/lib/easing";
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

interface EasingTestButtonProps extends Omit<ButtonProps, 'type'> {
  easingFunction: EasingFunction;
  easingLabel: string;
  children?: string;
  useSymmetricEasing?: boolean; // If true, uses easeIn variant for exit
}

/**
 * Test button component for comparing different easing functions
 * Identical to AIButton hero variant but with customizable easing
 * Supports bidirectional easing (different functions for enter/exit)
 */
const EasingTestButton = (props: EasingTestButtonProps) => {
  const {
    easingFunction,
    easingLabel,
    useSymmetricEasing = false,
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

  useEffect(() => {
    angleRef.current = gradientAngle;
  }, [gradientAngle]);

  useEffect(() => {
    const startAngle = angleRef.current;
    const targetAngle = isHovered ? 315 : 135;
    const startTime = Date.now();
    const duration = 300;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Use the provided easing for enter, and optionally use its inverse for exit
      let easeProgress: number;
      if (useSymmetricEasing && !isHovered) {
        // On exit, use easeInCubic for symmetric feel
        easeProgress = easeInCubic(progress);
      } else {
        // On enter, use the provided easing function
        easeProgress = easingFunction(progress);
      }

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
  }, [easingFunction, useSymmetricEasing, isHovered]);

  const handleMouseEnter: ButtonProps["onMouseEnter"] = (event) => {
    setIsHovered(true);
    userMouseEnter?.(event);
  };

  const handleMouseLeave: ButtonProps["onMouseLeave"] = (event) => {
    setIsHovered(false);
    userMouseLeave?.(event);
  };

  const getStateClass = () => isHovered ? styles["aiButton--hovered"] : styles["aiButton--idle"];
  const getWrapperStateClass = () => isHovered ? styles["aiButtonWrapper--hovered"] : styles["aiButtonWrapper--idle"];

  const sharedStyle = {
    '--ai-border-width': resolvedBorderWidth,
    '--ai-border-radius': resolvedBorderRadius,
    '--ai-button-height': `${resolvedHeight}px`,
    '--ai-padding-inline': resolvedPaddingInline,
    '--ai-padding-block': resolvedPaddingBlock,
    '--ai-button-angle': `${gradientAngle}deg`,
  } as CSSProperties;

  return (
    <div>
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
              variant="white"
              size={iconSize}
              className={styles.sparkleIcon}
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
      <div className="text-xs text-center mt-2 font-medium text-gray-700">
        {easingLabel}
      </div>
    </div>
  );
};

export default EasingTestButton;
