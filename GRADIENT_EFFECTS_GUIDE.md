# Gradient Animation Effects Guide

This guide documents the implementation of two beautiful gradient animation effects: **Rotating Gradient** and **Shimmer Effect**. These effects are used in the AI Button component to create engaging, premium interactions.

---

## Table of Contents

1. [Rotating Gradient Effect](#rotating-gradient-effect)
2. [Shimmer Effect](#shimmer-effect)
3. [Shared Dependencies](#shared-dependencies)
4. [Usage Examples](#usage-examples)

---

## Rotating Gradient Effect

The rotating gradient effect smoothly animates the gradient angle from 135° to 315° on hover, creating a dynamic color shift with enhanced saturation and brightness.

### TypeScript/React Implementation

```tsx
import { useState, useEffect, useRef } from "react";

// Component state
const [isHovered, setIsHovered] = useState(false);
const [gradientAngle, setGradientAngle] = useState(135);
const animationRef = useRef<number | null>(null);
const angleRef = useRef(gradientAngle);

// Keep angleRef in sync with gradientAngle
useEffect(() => {
  angleRef.current = gradientAngle;
}, [gradientAngle]);

// Animate gradient angle on hover state change
useEffect(() => {
  const startAngle = angleRef.current;
  const targetAngle = isHovered ? 315 : 135;
  const startTime = Date.now();
  const duration = 600; // milliseconds

  const animate = () => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease-in-out cubic easing function
    const easeProgress =
      progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

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
}, [isHovered]);

// Mouse event handlers
const handleMouseEnter = () => setIsHovered(true);
const handleMouseLeave = () => setIsHovered(false);

// Apply angle to component
const style = {
  '--ai-button-angle': `${gradientAngle}deg`
} as React.CSSProperties;
```

### SCSS Implementation

```scss
// Shared variables (from _ai-variables.scss)
$primary-blue: #6EB8FF;
$primary-orange: #FF9E78;
$default-angle: 135deg;
$hover-angle: 315deg;

// Rotate variant styles
.aiButton--rotate {
  // Dynamic gradient using CSS variable
  background: linear-gradient(
    var(--ai-button-angle, #{$default-angle}),
    $primary-blue 0%,
    $primary-orange 100%
  ) !important;

  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
              0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  color: white !important;

  // State modifiers for enhanced visual feedback
  &.aiButton--idle {
    filter: saturate(1) brightness(1);
  }

  &.aiButton--hovered {
    filter: saturate(1.5) brightness(1.15);
  }
}
```

### Key Features

- **Smooth Animation**: Uses `requestAnimationFrame` for 60fps performance
- **Easing Function**: Cubic ease-in-out for natural motion
- **Bidirectional**: Animates both on hover and hover exit
- **Enhanced Saturation**: 1.5x saturation + 1.15x brightness on hover
- **Duration**: 600ms for smooth, noticeable transition

---

## Shimmer Effect

The shimmer effect creates an elegant light sweep animation across the button on hover, simulating a reflective surface catching light.

### TypeScript/React Implementation

```tsx
import { useState } from "react";

// Component state
const [isHovered, setIsHovered] = useState(false);

// Mouse event handlers
const handleMouseEnter = () => setIsHovered(true);
const handleMouseLeave = () => setIsHovered(false);

// Shimmer overlay element (inside button)
<div className={styles.aiButton__overlay} />
```

### SCSS Implementation

```scss
// Shared variables
$primary-blue: #6EB8FF;
$primary-orange: #FF9E78;

// Shimmer variant styles
.aiButton--shimmer {
  overflow: hidden;
  position: relative;

  // Static gradient background
  background: linear-gradient(
    135deg,
    $primary-blue 0%,
    $primary-orange 100%
  ) !important;

  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
              0 4px 6px -2px rgba(0, 0, 0, 0.05);
  color: white !important;
}

// Shimmer overlay element
.aiButton__overlay {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  pointer-events: none;

  // Semi-transparent white gradient for shine effect
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );

  transition: transform 0.8s ease;
  transform: translateX(-100%);

  // Trigger shimmer animation on parent hover
  .aiButton--shimmer.aiButton--hovered & {
    transform: translateX(100%);
  }
}
```

### Key Features

- **Pure CSS Animation**: Uses CSS transforms for hardware acceleration
- **Horizontal Sweep**: 90° gradient moves left to right
- **Timing**: 800ms for elegant, noticeable sweep
- **Opacity**: 40% white for subtle, premium effect
- **Non-intrusive**: `pointer-events: none` prevents interaction blocking

---

## Shared Dependencies

### SCSS Variables File (`_ai-variables.scss`)

```scss
// ============================================
// Core Color Palette
// ============================================

// Primary gradient colors
$primary-blue: #6EB8FF;      // Light blue from gradient start
$primary-orange: #FF9E78;    // Peach from gradient end

// Gradient angles
$gradient-primary-angle: 135deg;  // Default diagonal
$gradient-hover-angle: 315deg;    // Rotated diagonal

// UI colors
$text-dark: hsl(0, 0%, 16%);
$white: white;

// ============================================
// Common Mixins
// ============================================

@mixin buttonReset {
  border: none !important;
  outline: none;
  cursor: pointer;
}

@mixin transitionAll($duration: 0.3s) {
  transition: all $duration ease;
}

@mixin boxShadowLg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
              0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
```

### Base Button Styles

```scss
@import '@/styles/_ai-variables.scss';

// Button-specific angle aliases
$default-angle: $gradient-primary-angle;
$hover-angle: $gradient-hover-angle;

// Base styles applied to all variants
.aiButton {
  @include buttonReset;
  @include transitionAll;

  // CSS custom properties for dynamic styling
  --ai-button-angle: #{$default-angle};
  --ai-gradient-intensity: 1;
  --ai-border-width: 1px;

  // State modifiers
  &--idle {
    filter: saturate(1) brightness(1);
  }

  &--hovered {
    filter: saturate(1.5) brightness(1.15);
  }
}
```

---

## Usage Examples

### Full Component Example

```tsx
import { useState, useEffect, useRef, type ReactNode } from "react";
import { Button } from "antd";
import type { ButtonProps } from "antd";
import AISparkleIcon from "./AISparkleIcon";
import styles from "./AIButton.module.scss";

interface AIButtonProps extends Omit<ButtonProps, 'type' | 'variant'> {
  variant: "rotate" | "shimmer";
  children?: ReactNode;
}

const AIButton = (props: AIButtonProps) => {
  const {
    variant,
    className,
    children = "Summarize",
    onClick,
    onMouseEnter: userMouseEnter,
    onMouseLeave: userMouseLeave,
    ...restProps
  } = props;

  const [isHovered, setIsHovered] = useState(false);
  const [gradientAngle, setGradientAngle] = useState(135);
  const animationRef = useRef<number | null>(null);
  const angleRef = useRef(gradientAngle);

  // Determine if this variant uses gradient animation
  const animateGradient = variant === "rotate";

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
        progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

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

  const handleMouseEnter: ButtonProps["onMouseEnter"] = (event) => {
    setIsHovered(true);
    userMouseEnter?.(event);
  };

  const handleMouseLeave: ButtonProps["onMouseLeave"] = (event) => {
    setIsHovered(false);
    userMouseLeave?.(event);
  };

  const getStateClass = () =>
    isHovered ? styles["aiButton--hovered"] : styles["aiButton--idle"];

  const angleStyle = animateGradient
    ? { '--ai-button-angle': `${gradientAngle}deg` } as React.CSSProperties
    : undefined;

  switch (variant) {
    case "rotate":
      return (
        <Button
          type="primary"
          icon={<AISparkleIcon variant="black" size={20} />}
          className={`${styles.aiButton} ${styles["aiButton--rotate"]} ${getStateClass()} ${className || ""}`}
          style={angleStyle}
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
          className={`${styles.aiButton} ${styles["aiButton--shimmer"]} ${getStateClass()} ${className || ""}`}
          onClick={onClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          {...restProps}
        >
          <div className={styles.aiButton__overlay} />
          {children}
        </Button>
      );

    default:
      return null;
  }
};

export default AIButton;
```

### Usage in React Components

```tsx
import AIButton from "@/components/AIButton";
import { toast } from "sonner";

// Rotating gradient button
<AIButton
  variant="rotate"
  onClick={() => toast.success("Rotating gradient clicked!")}
>
  Generate Summary
</AIButton>

// Shimmer effect button
<AIButton
  variant="shimmer"
  size="large"
  onClick={() => toast.success("Shimmer effect clicked!")}
>
  Analyze Data
</AIButton>
```

---

## Technical Notes

### Performance Considerations

1. **requestAnimationFrame**: Ensures animations run at 60fps synchronized with browser repaints
2. **CSS Transforms**: Shimmer uses `translateX` which is GPU-accelerated
3. **Cleanup**: Animation frames are properly cancelled in cleanup functions
4. **Refs**: `useRef` prevents unnecessary re-renders during animation

### Browser Compatibility

- **CSS Variables**: Supported in all modern browsers (IE11+ with fallbacks)
- **Linear Gradients**: Universal support
- **requestAnimationFrame**: Universal support in modern browsers

### Customization Options

Both effects can be customized via:

- **Colors**: Modify `$primary-blue` and `$primary-orange` in `_ai-variables.scss`
- **Duration**: Change `duration` constant in animation code
- **Angles**: Adjust `$default-angle` and `$hover-angle`
- **Saturation/Brightness**: Modify filter values in hovered state
- **Shadow**: Adjust `@mixin boxShadowLg` for different elevations

---

## Design Rationale

### Rotating Gradient
- **Use Case**: Primary AI actions that require attention
- **User Feedback**: Clear indication of interactive element
- **Premium Feel**: Smooth, sophisticated animation conveys quality
- **Direction**: 135° to 315° creates diagonal sweep that feels natural

### Shimmer Effect
- **Use Case**: Secondary AI actions or alternative visual style
- **User Feedback**: Subtle elegance without overwhelming user
- **Speed**: 800ms is slow enough to be noticed but fast enough to feel responsive
- **Opacity**: 40% white provides visible shine without washing out gradient

---

## Related Files

- `src/components/AIButton.tsx` - Component implementation
- `src/components/AIButton.module.scss` - Complete styles
- `src/styles/_ai-variables.scss` - Shared variables and mixins
- `src/pages/AIIconographyShowcase.tsx` - Live examples

---

## License

Part of the Arovy AI Playground project. See main project README for licensing information.
