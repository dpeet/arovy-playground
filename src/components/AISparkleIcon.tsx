import AISparkleBadge from "./AISparkleBadge";
import AISparkleCircle from "./AISparkleCircle";
import SparkleIconSVG from "./SparkleIconSVG";
import { cn } from "@/lib/utils";
import styles from "./AISparkleIcon.module.scss";

interface AISparkleIconProps {
  className?: string;
  variant?: "color" | "black" | "disabled" | "circle" | "badge" | "inline";
  size?: number; // default 24px; only used for color/black/disabled/inline variants (circle/badge use fixed SCSS sizes)
  animate?: boolean;
  showLabel?: boolean; // for badge variant
}

/**
 * Main AI Sparkle Icon component
 * Supports 3 core variants (color, black, disabled) + 3 special variants (circle, badge, inline)
 *
 * Sizing behavior:
 * - color/black/disabled: Controlled by `size` prop (default 24px)
 * - circle: Fixed 48x48px container with 32x32px SVG (controlled by SCSS)
 * - badge: Fixed 16x16px SVG (controlled by SCSS)
 * - inline: Scales to 1em via CSS, `size` prop sets initial dimensions
 *
 * @example
 * ```tsx
 * // Primary AI action (dynamic size)
 * <AISparkleIcon variant="color" size={24} />
 *
 * // Secondary action (dynamic size)
 * <AISparkleIcon variant="black" size={20} />
 *
 * // Disabled state (dynamic size)
 * <AISparkleIcon variant="disabled" size={20} />
 *
 * // Circular icon (fixed: 48x48 container, 32x32 SVG)
 * <AISparkleIcon variant="circle" />
 *
 * // Attribution badge (fixed: 16x16 SVG)
 * <AISparkleIcon variant="badge" showLabel />
 *
 * // Inline with text (scales to font size)
 * <AISparkleIcon variant="inline" />
 * ```
 */
const AISparkleIcon = ({
  className,
  variant = "color",
  size = 24,
  animate = false,
  showLabel = true
}: AISparkleIconProps) => {
  // Special variants with their own components
  if (variant === "circle") {
    return <AISparkleCircle className={className} animate={animate} />;
  }

  if (variant === "badge") {
    return <AISparkleBadge className={className} showLabel={showLabel} animate={animate} />;
  }

  if (variant === "inline") {
    return (
      <span className={cn(styles.inline, className)}>
        <SparkleIconSVG variant="color" size={size} animate={animate} />
      </span>
    );
  }

  // Standard variants (color, black, disabled)
  return (
    <div className={className}>
      <SparkleIconSVG
        variant={variant as "color" | "black" | "disabled"}
        size={size}
        animate={animate}
      />
    </div>
  );
};

export default AISparkleIcon;

// Export individual components for direct usage
export { SparkleIconSVG, AISparkleCircle, AISparkleBadge };
