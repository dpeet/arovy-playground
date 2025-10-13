import { Button } from "antd";
import type { ButtonProps } from "antd";
import { cn } from "@/lib/utils";
import SparkleIconSVG from "./SparkleIconSVG";
import styles from "./AIIconButton.module.scss";

interface AIIconButtonProps extends Omit<ButtonProps, "icon" | "children"> {
  iconSize?: "small" | "medium" | "large";
  "aria-label"?: string;
}

/**
 * AI Sparkle Icon Button
 *
 * An icon-only button that displays a black sparkle icon by default,
 * transitioning to the gradient version on hover with smooth animations.
 *
 * @example
 * ```tsx
 * // Small icon button (16px)
 * <AIIconButton iconSize="small" onClick={handleClick} aria-label="AI action" />
 *
 * // Medium icon button (20px) - default
 * <AIIconButton onClick={handleClick} />
 *
 * // Large icon button (24px)
 * <AIIconButton iconSize="large" onClick={handleClick} />
 * ```
 */
const AIIconButton = ({
  className,
  iconSize = "medium",
  onClick,
  disabled,
  "aria-label": ariaLabel = "AI action",
  ...restProps
}: AIIconButtonProps) => {
  // Map icon sizes to pixel values
  const sizeMap = {
    small: 16,
    medium: 20,
    large: 24
  };

  const pixelSize = sizeMap[iconSize];

  // Map to Ant Design button sizes
  const buttonSizeMap = {
    small: "small" as const,
    medium: "middle" as const,
    large: "middle" as const // Use middle for large icon to keep button compact
  };

  const buttonSize = buttonSizeMap[iconSize];

  return (
    <Button
      type="text"
      className={cn(
        styles.aiIconButton,
        styles[`aiIconButton--${iconSize}`],
        className
      )}
      onClick={onClick}
      disabled={disabled}
      size={buttonSize}
      aria-label={ariaLabel}
      {...restProps}
    >
      <div className={styles.iconWrapper}>
        {/* Black version (default state) */}
        <SparkleIconSVG
          variant="black"
          size={pixelSize}
          className={styles.iconBlack}
        />
        {/* Color version (hover state) */}
        <SparkleIconSVG
          variant="color"
          size={pixelSize}
          className={styles.iconColor}
        />
      </div>
    </Button>
  );
};

export default AIIconButton;