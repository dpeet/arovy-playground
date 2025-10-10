import { Button } from "antd";
import type { ButtonProps } from "antd";
import { cn } from "@/lib/utils";
import AISparkleIcon from "./AISparkleIcon";

interface AIIconButtonProps extends Omit<ButtonProps, 'icon'> {
  variant?: "gradient" | "subtle" | "ghost";
  sparkleSize?: "xs" | "sm" | "md" | "lg";
}

const AIIconButton = ({
  variant = "gradient",
  sparkleSize = "md",
  className,
  ...props
}: AIIconButtonProps) => {

  const getButtonStyle = () => {
    switch (variant) {
      case "gradient":
        return {
          background: "linear-gradient(135deg, #5B9FF5 0%, #E8956D 100%)",
          border: "none",
          color: "white"
        };
      case "subtle":
        return {
          background: "linear-gradient(135deg, rgba(91, 159, 245, 0.1) 0%, rgba(232, 149, 109, 0.1) 100%)",
          border: "1px solid transparent",
          color: "#5B9FF5"
        };
      case "ghost":
        return {
          background: "transparent",
          border: "none",
          color: "#5B9FF5"
        };
      default:
        return {};
    }
  };

  return (
    <Button
      {...props}
      className={cn(
        "ai-icon-button",
        "transition-all duration-300",
        variant === "gradient" && "hover:shadow-lg hover:scale-105",
        variant === "subtle" && "hover:border-blue-400",
        variant === "ghost" && "hover:bg-blue-50",
        className
      )}
      style={getButtonStyle()}
      icon={
        <AISparkleIcon
          size={sparkleSize}
          variant={variant === "ghost" ? "solid" : "gradient"}
          color={variant === "gradient" ? "default" : "primary"}
        />
      }
    />
  );
};

export default AIIconButton;