# AI Button Implementation Guide

This guide documents the implementation of the **Combined Gradient Button** - a premium AI button with rotating gradient background, animated border, and glow effects. This is the hero button used for primary AI actions.

---

## Table of Contents

1. [Combined Gradient Button](#combined-gradient-button)
2. [Outline Button (Secondary)](#outline-button-secondary)
3. [Shared Dependencies](#shared-dependencies)
4. [Usage Examples](#usage-examples)
5. [Technical Details](#technical-details)

---

## Combined Gradient Button

The combined button is the hero AI action button featuring:
- **Rotating gradient background** (135° to 315° on hover)
- **Animated gradient border** that rotates in sync
- **Drop shadow effects** that intensify on hover
- **Enhanced saturation and brightness** filters

This creates the most premium, attention-grabbing button for primary AI actions.

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
// Combined variant wrapper with animated gradient border
.aiButtonWrapper--combined {
  display: inline-block;
  padding: var(--ai-border-width, 2px);
  border-radius: 0.375rem;
  transition: all 0.3s ease;
  margin: calc(var(--ai-border-width, 2px) * -1);

  &.aiButtonWrapper--idle {
    background: linear-gradient(
      var(--ai-button-angle, 135deg),
      #5AA8E8 24.61%,
      #E88A6D 75.39%
    );
    filter: drop-shadow(3px 3px 6px rgba(68, 163, 255, 0.25))
            drop-shadow(3px 3px 6px rgba(255, 134, 87, 0.25));
  }

  &.aiButtonWrapper--hovered {
    background: linear-gradient(
      var(--ai-button-angle, 315deg),
      #6EB8FF 24.61%,
      #FF9E78 75.39%
    );
    filter: drop-shadow(3px 3px 6px rgba(110, 184, 255, 0.35))
            drop-shadow(3px 3px 6px rgba(255, 158, 120, 0.35));
  }
}

// Inner button with rotating gradient background
.aiButton--combined {
  --ai-gradient-intensity: 1;
  --ai-border-width: 2px;

  box-shadow: none !important;
  color: white !important;

  &.aiButton--idle {
    background: linear-gradient(
      var(--ai-button-angle, 135deg),
      #6EB8FF 24.61%,
      #FF9E78 75.39%
    ) !important;
  }

  &.aiButton--hovered {
    background: linear-gradient(
      var(--ai-button-angle, 315deg),
      #7FC5FF 24.61%,
      #FFAB8C 75.39%
    ) !important;
  }
}
```

### Key Features

- **Smooth Animation**: Uses `requestAnimationFrame` for 60fps performance
- **Easing Function**: Cubic ease-in-out for natural motion
- **Bidirectional**: Animates both on hover and hover exit
- **Enhanced Saturation**: 1.5x saturation + 1.15x brightness on hover
- **Duration**: 600ms for smooth, noticeable transition
- **Border Animation**: Gradient border rotates in sync with background
- **Glow Effects**: Dual-color drop shadows that intensify on hover

---

## Outline Button (Secondary)

The outline variant is for secondary AI actions:
- Static gradient border (no rotation)
- Subtle gradient colors (30% intensity)
- White background
- Color transition on hover

### SCSS Implementation

```scss
// Wrapper with gradient border
.aiButtonWrapper--outline {
  display: inline-block;
  padding: var(--ai-border-width, 1px);
  border-radius: 0.375rem;
  transition: all 0.3s ease;
  margin: calc(var(--ai-border-width) * -1);

  background: linear-gradient(
    135deg,
    #6EB8FF 0%,
    #FF9E78 100%
  );

  &.aiButtonWrapper--idle {
    filter: saturate(1) brightness(1);
  }

  &.aiButtonWrapper--hovered {
    filter: saturate(1.5) brightness(1.15);
  }
}

// Inner button
.aiButton--outline {
  --ai-gradient-intensity: 0.3;
  --ai-border-width: 1px;

  background: white !important;
  box-shadow: none !important;
  transition: all 0.3s ease;

  &.aiButton--idle {
    color: #292929 !important;
  }

  &.aiButton--hovered {
    color: #6EB8FF !important;
  }
}
```

---

## Shared Dependencies

### SCSS Variables File (`_ai-variables.scss`)

```scss
// ============================================
// Core Color Palette
// ============================================

// Primary gradient colors
$primary-blue: #6EB8FF;
$primary-orange: #FF9E78;

// Gradient angles
$gradient-primary-angle: 135deg;
$gradient-hover-angle: 315deg;

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

.aiButton {
  @include buttonReset;
  @include transitionAll;

  color: $text-dark;

  // CSS custom properties
  --ai-button-angle: #{$gradient-primary-angle};
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

### Component Interface

```tsx
interface AIButtonProps extends Omit<ButtonProps, 'type' | 'variant'> {
  variant: "combined" | "outline";
  children?: ReactNode;
  gradientIntensity?: number; // 0-1, controls gradient vibrancy
  borderWidth?: string; // CSS value like "1px", "2px"
}
```

### Usage in React Components

```tsx
import AIButton from "@/components/AIButton";
import { toast } from "sonner";

// Hero AI button (primary action)
<AIButton
  variant="combined"
  size="large"
  onClick={() => toast.success("AI action triggered!")}
>
  Summarize with AI
</AIButton>

// Secondary AI button
<AIButton
  variant="outline"
  onClick={() => toast.success("Secondary action!")}
>
  Generate Report
</AIButton>

// Custom border width
<AIButton
  variant="combined"
  borderWidth="3px"
>
  Enhanced AI Action
</AIButton>
```

---

## Technical Details

### Performance Considerations

1. **requestAnimationFrame**: Ensures animations run at 60fps synchronized with browser repaints
2. **CSS Variables**: Enable dynamic angle updates without re-rendering
3. **Cleanup**: Animation frames are properly cancelled in cleanup functions
4. **Refs**: `useRef` prevents unnecessary re-renders during animation

### Browser Compatibility

- **CSS Variables**: Supported in all modern browsers
- **Linear Gradients**: Universal support
- **requestAnimationFrame**: Universal support in modern browsers
- **drop-shadow**: CSS filter supported in all modern browsers

### Customization Options

The combined button can be customized via:

- **Colors**: Modify color variables in `_ai-variables.scss`
- **Duration**: Change `duration` constant (600ms default)
- **Angles**: Adjust `$gradient-primary-angle` (135deg) and `$gradient-hover-angle` (315deg)
- **Saturation/Brightness**: Modify filter values (1.5x and 1.15x)
- **Border Width**: Pass `borderWidth` prop or adjust `--ai-border-width`
- **Shadow Intensity**: Modify drop-shadow opacity values

### Color Palette (HSL Format)

```scss
// Primary gradient
$primary-blue: hsl(208, 100%, 72%);     // #6EB8FF
$primary-orange: hsl(17, 100%, 74%);    // #FF9E78

// Combined idle state
$combined-blue-idle: hsl(208, 77%, 65%);     // #5AA8E8
$combined-orange-idle: hsl(17, 77%, 67%);    // #E88A6D

// Combined hover (inner)
$combined-blue-inner-hover: hsl(208, 100%, 75%);   // #7FC5FF
$combined-orange-inner-hover: hsl(17, 100%, 77%);  // #FFAB8C
```

---

## Design Rationale

### Combined Button
- **Use Case**: Primary AI actions that require maximum attention
- **User Feedback**: Clear, animated indication of interactive element
- **Premium Feel**: Rotating gradient + border + glow = ultra-premium
- **Direction**: 135° to 315° creates diagonal sweep that feels natural
- **Glow**: Dual-color shadows reinforce gradient direction

### Outline Button
- **Use Case**: Secondary AI actions that need less visual weight
- **User Feedback**: Subtle gradient border indicates AI capability
- **Contrast**: White background ensures good text readability
- **Static**: No rotation keeps it visually subordinate to combined button

---

## Implementation Checklist

When implementing these buttons:

- [ ] Import `AIButton` component
- [ ] Use `variant="combined"` for primary AI actions
- [ ] Use `variant="outline"` for secondary AI actions
- [ ] Add `AISparkleIcon` (automatically included in button)
- [ ] Test hover states in browser
- [ ] Verify animation smoothness (60fps)
- [ ] Check accessibility (keyboard navigation, focus states)
- [ ] Test on different screen sizes

---

## Related Files

- `src/components/AIButton.tsx` - Component implementation
- `src/components/AIButton.module.scss` - Complete styles
- `src/styles/_ai-variables.scss` - Shared variables and mixins
- `src/pages/AIIconographyShowcase.tsx` - Live showcase
- `CLAUDE.md` - Project guidelines and usage

---

## License

Part of the Arovy AI Playground project. See main project README for licensing information.
