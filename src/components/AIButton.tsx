import { useState, useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import SparkleIcon from "./SparkleIcon";

interface AIButtonProps {
  variant: "rotate" | "shimmer" | "outline" | "combined";
  children?: ReactNode;
  onClick?: () => void;
  className?: string;
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

const AIButton = ({ variant, children = "Summarize", onClick, className }: AIButtonProps) => {
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

  const containerClassName = cn(
    "inline-block",
    config.containerClassName,
    config.classTarget === "container" ? className : undefined,
  );
  const buttonClassName = cn(
    "flex px-4 py-2 items-center gap-2 rounded border cursor-pointer font-medium text-sm transition-all duration-300 relative",
    config.buttonClassName,
    config.classTarget === "button" ? className : undefined,
  );

  const containerStyle = config.containerStyle?.(state);
  const buttonStyle = config.buttonStyle?.(state);
  const iconFill = config.iconFill?.(state) ?? "white";
  const overlay = config.overlay?.(state);

  return (
    <div
      className={containerClassName}
      style={containerStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button className={buttonClassName} style={buttonStyle} onClick={onClick}>
        {overlay}
        <SparkleIcon fill={iconFill} className={config.iconClassName} />
        <span className={config.labelClassName}>{children}</span>
      </button>
    </div>
  );
};

export default AIButton;
