import SparkleIconSVG from "./SparkleIconSVG";
import { cn } from "@/lib/utils";
import styles from "./AISparkleIcon.module.scss";

interface AISparkleBadgeProps {
  className?: string;
  showLabel?: boolean;
}

/**
 * Compact AI attribution badge with gradient background
 * - Badge: Inline-flex container with gradient and padding
 * - SVG: 16x16px sparkle (size controlled by SCSS .badge svg rule)
 *
 * Use for: Attribution labels, status indicators, AI-generated tags
 * Background gradient: 90deg, #C8E4FF → #FFBFA6
 */
const AISparkleBadge = ({ className, showLabel = true }: AISparkleBadgeProps) => {
  return (
    <div className={cn(styles.badge, className)}>
      <SparkleIconSVG variant="black" disableInlineSize />
      {showLabel && <span>AI</span>}
    </div>
  );
};

export default AISparkleBadge;
