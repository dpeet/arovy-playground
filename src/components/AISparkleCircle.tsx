import SparkleIconSVG from "./SparkleIconSVG";
import { cn } from "@/lib/utils";
import styles from "./AISparkleIcon.module.scss";

interface AISparkleCircleProps {
  className?: string;
}

/**
 * 48x48 circular AI sparkle icon with gradient background
 * - Container: 48x48px circle with gradient background
 * - SVG: 32x32px sparkle (size controlled by SCSS .circle svg rule)
 *
 * Use for: Feature cards, empty states, standalone icons
 */
const AISparkleCircle = ({ className }: AISparkleCircleProps) => {
  return (
    <div className={cn(styles.circle, className)}>
      <SparkleIconSVG variant="black" disableInlineSize />
    </div>
  );
};

export default AISparkleCircle;
