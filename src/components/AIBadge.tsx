import { Badge, Tag } from "antd";
import { cn } from "@/lib/utils";
import AISparkleIcon from "./AISparkleIcon";

interface AIBadgeProps {
  variant?: "badge" | "tag" | "inline" | "circle";
  size?: "small" | "default" | "large";
  className?: string;
  children?: React.ReactNode;
  showIcon?: boolean;
  gradient?: boolean;
}

const AIBadge = ({
  variant = "badge",
  size = "default",
  className,
  children,
  showIcon = true,
  gradient = true
}: AIBadgeProps) => {

  const iconSize = size === "small" ? "xs" : size === "large" ? "md" : "sm";
  const icon = showIcon ? <AISparkleIcon size={iconSize} variant={gradient ? "gradient" : "solid"} /> : null;

  switch (variant) {
    case "badge":
      return (
        <Badge
          count={icon}
          className={cn(
            "ai-badge",
            gradient && "ai-badge--gradient",
            className
          )}
          style={{
            backgroundColor: gradient ? undefined : "#f0f5ff",
            borderColor: gradient ? undefined : "#91d5ff"
          }}
        >
          {children}
        </Badge>
      );

    case "tag":
      return (
        <Tag
          icon={icon}
          className={cn(
            "ai-tag",
            "inline-flex items-center gap-1",
            size === "small" && "text-xs px-1.5 py-0.5",
            size === "default" && "text-sm px-2 py-1",
            size === "large" && "text-base px-3 py-1.5",
            gradient && "border-0",
            className
          )}
          style={{
            background: gradient
              ? "linear-gradient(135deg, rgba(91, 159, 245, 0.1) 0%, rgba(232, 149, 109, 0.1) 100%)"
              : "#f0f5ff",
            borderColor: gradient ? "transparent" : "#91d5ff",
            color: "#000000e0"
          }}
        >
          {!showIcon && children}
          {showIcon && (children || "AI")}
        </Tag>
      );

    case "inline":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1",
            size === "small" && "text-xs",
            size === "default" && "text-sm",
            size === "large" && "text-base",
            className
          )}
        >
          {icon}
          {children && <span>{children}</span>}
        </span>
      );

    case "circle":
      return (
        <div
          className={cn(
            "ai-badge-circle",
            "inline-flex items-center justify-center rounded-full",
            size === "small" && "w-5 h-5",
            size === "default" && "w-8 h-8",
            size === "large" && "w-12 h-12",
            className
          )}
          style={{
            background: gradient
              ? "linear-gradient(135deg, rgba(91, 159, 245, 0.15) 0%, rgba(232, 149, 109, 0.15) 100%)"
              : "#f0f5ff",
            border: gradient ? "1px solid transparent" : "1px solid #91d5ff"
          }}
        >
          <AISparkleIcon
            size={size === "small" ? "xs" : size === "large" ? "lg" : "md"}
            variant={gradient ? "gradient" : "solid"}
          />
        </div>
      );

    default:
      return null;
  }
};

export default AIBadge;