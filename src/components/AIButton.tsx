import { useState, useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { Button } from "antd";
import type { ButtonProps } from "antd";
import { cn } from "@/lib/utils";
import SparkleIcon from "./SparkleIcon";

interface AIButtonProps extends Omit<ButtonProps, 'type' | 'variant'> {
  variant: "rotate" | "shimmer" | "outline" | "combined";
  children?: ReactNode;
  type?: ButtonProps["type"]; // Re-add type as optional to avoid TS errors
}

type VariantKey = AIButtonProps["variant"];

interface VariantState {
  hovered: boolean;
  angle: number;
}

interface VariantConfig {
  classTarget: "button" | "container";
  containerClassName?: string;
  containerStyle?: (state: VariantState) => CSSProperties | undefined;
  buttonClassName?: string;
  buttonStyle?: (state: VariantState) => CSSProperties | undefined;
  iconFill?: (state: VariantState) => string;
  iconClassName?: string;
  labelClassName?: string;
  overlay?: (state: VariantState) => ReactNode;
  gradient?: {
    animate: boolean;
    idleAngle: number;
    hoverAngle: number;
  };
}

const VARIANT_CONFIG: Record<VariantKey, VariantConfig> = {
  rotate: {
    classTarget: "button",
    buttonClassName: "text-primary-foreground shadow-lg",
    buttonStyle: ({ angle, hovered }) => ({
      background: `linear-gradient(${angle}deg, hsl(207 70% 63%) 0%, hsl(18 72% 61%) 100%)`,
      filter: hovered ? "saturate(1.5) brightness(1.15)" : "saturate(1) brightness(1)",
    }),
    gradient: {
      animate: true,
      idleAngle: 135,
      hoverAngle: 315,
    },
  },
  shimmer: {
    classTarget: "button",
    buttonClassName: "text-primary-foreground shadow-lg overflow-hidden",
    buttonStyle: ({ hovered }) => ({
      background: "linear-gradient(135deg, hsl(207 70% 63%) 0%, hsl(18 72% 61%) 100%)",
      filter: hovered ? "saturate(1.5) brightness(1.15)" : "saturate(1) brightness(1)",
    }),
    overlay: ({ hovered }) => (
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)",
          transform: hovered ? "translateX(100%)" : "translateX(-100%)",
          transition: "transform 0.8s ease",
        }}
      />
    ),
    iconClassName: "relative z-10",
    labelClassName: "relative z-10",
  },
  outline: {
    classTarget: "container",
    containerClassName: "p-[2px] rounded transition-all duration-300",
    containerStyle: ({ hovered }) => ({
      background: "linear-gradient(135deg, hsl(207 70% 63%) 0%, hsl(18 72% 61%) 100%)",
      filter: hovered ? "saturate(1.5) brightness(1.15)" : "saturate(1) brightness(1)",
    }),
    buttonClassName: "bg-card border-none shadow-none font-semibold",
    buttonStyle: ({ hovered }) => ({
      color: hovered ? "hsl(207 70% 63%)" : "hsl(0 0% 16%)",
      transition: "color 0.3s ease",
    }),
    iconFill: ({ hovered }) => (hovered ? "hsl(207 70% 63%)" : "hsl(0 0% 16%)"),
    iconClassName: "transition-colors duration-300",
  },
  combined: {
    classTarget: "container",
    containerClassName: "p-[2px] rounded transition-all duration-300",
    containerStyle: ({ hovered, angle }) => ({
      background: hovered
        ? `linear-gradient(${angle}deg, hsl(207 65% 58%) 24.61%, hsl(18 67% 56%) 75.39%)`
        : `linear-gradient(${angle}deg, hsl(207 60% 54%) 24.61%, hsl(18 62% 52%) 75.39%)`,
      filter: hovered
        ? "drop-shadow(3px 3px 6px rgba(90, 184, 255, 0.35)) drop-shadow(3px 3px 6px rgba(255, 158, 120, 0.35))"
        : "drop-shadow(3px 3px 6px rgba(68, 163, 255, 0.25)) drop-shadow(3px 3px 6px rgba(255, 134, 87, 0.25))",
    }),
    buttonClassName: "text-primary-foreground border-none shadow-none",
    buttonStyle: ({ hovered, angle }) => ({
      background: hovered
        ? `linear-gradient(${angle}deg, hsl(207 85% 68%) 24.61%, hsl(18 77% 66%) 75.39%)`
        : `linear-gradient(${angle}deg, hsl(207 75% 64%) 24.61%, hsl(18 72% 61%) 75.39%)`,
    }),
    gradient: {
      animate: true,
      idleAngle: 135,
      hoverAngle: 315,
    },
  },
};

const AIButton = (props: AIButtonProps) => {
  const {
    variant,
    className,
    children = "Summarize",
    onClick,
    onMouseEnter: userMouseEnter,
    onMouseLeave: userMouseLeave,
    ...restProps  // Capture all other Ant Design props
  } = props;

  const config = VARIANT_CONFIG[variant];
  const [isHovered, setIsHovered] = useState(false);
  const initialAngle = config.gradient?.idleAngle ?? 135;
  const [gradientAngle, setGradientAngle] = useState(initialAngle);
  const animationRef = useRef<number | null>(null);
  const angleRef = useRef(gradientAngle);

  useEffect(() => {
    angleRef.current = gradientAngle;
  }, [gradientAngle]);

  const animateGradient = config.gradient?.animate ?? false;
  const idleAngle = config.gradient?.idleAngle ?? 135;
  const hoverAngle = config.gradient?.hoverAngle ?? 315;

  useEffect(() => {
    if (!animateGradient) {
      setGradientAngle(idleAngle);
      return;
    }

    const startAngle = angleRef.current;
    const targetAngle = isHovered ? hoverAngle : idleAngle;
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
  }, [animateGradient, hoverAngle, idleAngle, isHovered]);

  const state: VariantState = {
    hovered: isHovered,
    angle: gradientAngle,
  };

  const iconFill = config.iconFill?.(state) ?? "white";

  // Compose hover handlers to preserve both internal state and user callbacks
  const handleMouseEnter: ButtonProps["onMouseEnter"] = (event) => {
    setIsHovered(true);
    userMouseEnter?.(event);
  };

  const handleMouseLeave: ButtonProps["onMouseLeave"] = (event) => {
    setIsHovered(false);
    userMouseLeave?.(event);
  };

  // Render different variants with Ant Design Button
  switch (variant) {
    case "rotate":
      return (
        <Button
          type="primary"
          icon={<SparkleIcon fill="white" />}
          className={cn("shadow-lg", className)}
          style={{
            background: `linear-gradient(${gradientAngle}deg, hsl(207 70% 63%) 0%, hsl(18 72% 61%) 100%)`,
            filter: isHovered ? "saturate(1.5) brightness(1.15)" : "saturate(1) brightness(1)",
            border: 'none',
            transition: 'all 0.3s ease',
          }}
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
          icon={<SparkleIcon fill="white" className="relative z-10" />}
          className={cn("shadow-lg overflow-hidden", className)}
          style={{
            background: "linear-gradient(135deg, hsl(207 70% 63%) 0%, hsl(18 72% 61%) 100%)",
            filter: isHovered ? "saturate(1.5) brightness(1.15)" : "saturate(1) brightness(1)",
            border: 'none',
            position: 'relative',
          }}
          onClick={onClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          {...restProps}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)",
              transform: isHovered ? "translateX(100%)" : "translateX(-100%)",
              transition: "transform 0.8s ease",
            }}
          />
          <span className="relative z-10">{children}</span>
        </Button>
      );

    case "outline":
      return (
        <div
          className={cn("inline-block p-[2px] rounded transition-all duration-300", className)}
          style={{
            background: "linear-gradient(135deg, hsl(207 70% 63%) 0%, hsl(18 72% 61%) 100%)",
            filter: isHovered ? "saturate(1.5) brightness(1.15)" : "saturate(1) brightness(1)",
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Button
            type="default"
            icon={<SparkleIcon fill={iconFill} className="transition-colors duration-300" />}
            className="bg-card border-none shadow-none font-semibold"
            style={{
              color: isHovered ? "hsl(207 70% 63%)" : "hsl(0 0% 16%)",
              background: 'white',
              transition: 'color 0.3s ease',
            }}
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
          className={cn("inline-block p-[2px] rounded transition-all duration-300", className)}
          style={{
            background: isHovered
              ? `linear-gradient(${gradientAngle}deg, hsl(207 65% 58%) 24.61%, hsl(18 67% 56%) 75.39%)`
              : `linear-gradient(${gradientAngle}deg, hsl(207 60% 54%) 24.61%, hsl(18 62% 52%) 75.39%)`,
            filter: isHovered
              ? "drop-shadow(3px 3px 6px rgba(90, 184, 255, 0.35)) drop-shadow(3px 3px 6px rgba(255, 158, 120, 0.35))"
              : "drop-shadow(3px 3px 6px rgba(68, 163, 255, 0.25)) drop-shadow(3px 3px 6px rgba(255, 134, 87, 0.25))",
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Button
            type="primary"
            icon={<SparkleIcon fill="white" />}
            className="border-none shadow-none"
            style={{
              background: isHovered
                ? `linear-gradient(${gradientAngle}deg, hsl(207 85% 68%) 24.61%, hsl(18 77% 66%) 75.39%)`
                : `linear-gradient(${gradientAngle}deg, hsl(207 75% 64%) 24.61%, hsl(18 72% 61%) 75.39%)`,
              border: 'none',
            }}
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
