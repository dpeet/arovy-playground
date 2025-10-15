# CLAUDE.md - Arovy AI Playground

AI component playground for enterprise security UX. React + TypeScript + Vite + Tailwind + Ant Design.

## Build & Run Commands

```bash
npm run dev          # Start dev server on port 5173
npm run build        # Production build
npm run lint         # ESLint check
npm run preview      # Preview production build
```

## Code Style & Constraints

### Import Conventions
- Absolute imports via `@/` alias for `src/`
- Component imports: `@/components/[component]`
- Utility imports: `@/lib/utils`
- CSS modules: `*.module.scss` files

### TypeScript
- Strict mode enabled
- Explicit return types for functions
- Interface over type for component props
- Destructure props with default values

### React Patterns
- Functional components only
- Custom hooks in `src/hooks/`
- Named exports for components
- Props interface suffix: `Props`

### CSS/Styling
- Tailwind utilities first
- SCSS modules for complex styles
- CSS variables via HSL colors
- Responsive design: mobile-first

## System Architecture

### Directory Structure
```
src/
├── components/      # Reusable UI components
│   ├── ui/          # shadcn/ui components
│   └── AI*.tsx      # AI-specific components
├── pages/           # Route components
├── lib/             # Utilities (cn, etc.)
└── main.tsx         # Entry point + router
```

### Key Components
- `AISparkleIcon`: Core sparkle with 6 variants (color, black, disabled, circle, badge, inline)
- `AIButton`: Full AI action buttons with 2 variants (hero/hero-outline) and shared gradient styling

### Routes
- `/` - AI component showcase (comprehensive gallery)
- `/ai-showcase` - Redirects to `/`
- `/button-test` - Button size testing

### Styling System
- **Primary**: #5B9FF5 (Sonar Blue)
- **Secondary**: #E8956D (Orange)
- **Gradient**: 135deg blue→orange
- **Text**: #000000e0 (WCAG AA)

## AI Component Guidelines

### Sparkle Usage
- **Primary actions**: White sparkle on colored buttons
- **Secondary**: Black sparkle on white buttons
- **Attribution**: Use the `AISparkleIcon` `badge` variant for inline AI labeling
- **Sizes**: xs(12), sm(16), md(20), lg(24), xl(32)

### Accessibility
- `aria-label` on all AI triggers
- `role="progressbar"` for processing states
- Focus rings: 2px visible outline
- Touch targets: min 44x44px
- Color contrast: 4.5:1 text, 3:1 UI

### Animation States
- **Available**: Static sparkle
- **Processing**: Pulse/shimmer animation
- **Generated**: Attribution badge

## Review Checklist

- [ ] Run `npm run lint` before commits
- [ ] Test all button states (hover/focus/disabled)
- [ ] Verify WCAG contrast ratios
- [ ] Check responsive breakpoints
- [ ] Test keyboard navigation
- [ ] Validate aria-labels

## Key Files Reference

- [vite.config.ts](vite.config.ts) - Build config with SCSS support
- [src/App.tsx](src/App.tsx) - Route definitions
- [tailwind.config.ts](tailwind.config.ts) - Theme tokens
- [AI_Iconography.md](AI_Iconography.md) - Detailed design specs

## Quick Start

```bash
# Install and run
npm install
npm run dev

# View AI components
# Navigate to http://localhost:5173/ai-showcase
```

## Component Usage Examples

```tsx
// Hero AI button (primary actions)
<AIButton variant="hero" size="large">
  Summarize with AI
</AIButton>

// Secondary AI button
<AIButton variant="hero-outline">
  Generate Report
</AIButton>

// Sparkle icon with animation
<AISparkleIcon
  variant="color"
  size={24}
  animate
/>

// Badge attribution
<AISparkleIcon variant="badge" />

// Circular highlight icon
<AISparkleIcon variant="circle" animate />
```

## Development Workflow

1. Create component in `src/components/`
2. Add to showcase in `src/pages/AIIconographyShowcase.tsx`
3. Test responsive design and states
4. Run `npm run lint` and fix issues
5. Verify accessibility with keyboard nav
6. Build and preview before PR

## Dependencies

- **React 18.3** + **TypeScript 5.9**
- **Vite 5.4** for fast builds
- **Tailwind 3.4** + **SCSS** for styling
- **Ant Design 5.27** for base components
- **React Router 6.30** for routing
- **clsx** + **tailwind-merge** for className utilities

## IMPORTANT: Gradient Border Implementation

### The Separate-Layer Architecture

The `AIButton` hero and hero-outline variants use a **separate-layer architecture** to achieve gradient borders with filters and effects. This architecture provides clean separation between border styling and button content.

#### Why We Need This
CSS does not support `border-image` with `border-radius`, and we need to apply filters (saturate/brightness, drop-shadow) to borders without affecting button content. We use a sibling-layer approach:

```
┌──────────────────────────────────┐
│ Wrapper (positioning context)    │
│                                   │
│  ┌────────────────────────────┐  │
│  │ Border Layer (absolute)    │  │ ← z-index: 1, with filter
│  └────────────────────────────┘  │
│  ┌────────────────────────────┐  │
│  │ Button (relative, margin)  │  │ ← z-index: 2, clean content
│  └────────────────────────────┘  │
└──────────────────────────────────┘
     ↑ Margin on button creates inset
```

#### Critical Rules - DO NOT VIOLATE

**1. Wrapper Element Requirements:**
```scss
.aiButtonWrapper--hero {
  position: relative;              // Positioning context for absolute children
  display: inline-flex;
  align-items: stretch;
  // ❌ NO padding, margin, background, or filter here
  // Just a positioning container
}
```

**2. Border Layer Requirements (Sibling to Button):**
```scss
.aiButtonBorder--hero {
  position: absolute;
  inset: 0;                        // Cover entire wrapper area
  z-index: 1;                      // Behind the button content
  pointer-events: none;            // Allow clicks to pass through
  background: linear-gradient(...); // The gradient border
  filter: drop-shadow(...);        // Effects applied ONLY to border
  border-radius: calc(radius + border-width);  // Outer corner
}
```

**3. Inner Button Requirements (Sibling to Border):**
```scss
.aiButton--hero {
  position: relative;
  z-index: 2;                      // Above the border layer
  margin: var(--ai-border-width);  // Creates inset to reveal border
  border-radius: var(--ai-border-radius);  // Inner corner
  background: linear-gradient(...); // Inner fill (hero) or white (hero-outline)
  // ❌ NO border property - not needed with separate layers
  // ❌ NO filter property - border effects isolated to border layer
}
```

#### Why Separate Layers?

**Benefits of the sibling-layer architecture:**
- **Filter isolation**: Filters (saturate, brightness, drop-shadow) affect ONLY the border, not button text/icons
- **Clean content**: Button content remains sharp and unfiltered
- **Consistent pattern**: Both hero and hero-outline variants use identical structure
- **No artifacts**: No dark lines or visual glitches between layers
- **Easy maintenance**: Border and content styling completely independent

#### Files That Implement This

- `src/components/AIButton.tsx` - Component structure (lines 140-236)
  - Wrapper: lines 191-201 (hero), 142-152 (hero-outline)
  - Border layer: lines 203-211 (hero), 154-162 (hero-outline)
  - Button: lines 214-234 (hero), 165-185 (hero-outline)
- `src/components/AIButton.module.scss` - Styles (lines 100-187)
  - Hero-outline: lines 100-158
  - Hero: lines 161-138

#### Common Patterns

✅ **CORRECT** - Separate layers with z-index stacking:
```tsx
<div className="aiButtonWrapper--hero">
  {/* Border layer - absolute, z-index: 1, with filter */}
  <div className="aiButtonBorder--hero" aria-hidden="true" />

  {/* Button - relative, z-index: 2, clean content */}
  <Button className="aiButton--hero">
    Content
  </Button>
</div>
```

❌ **WRONG** - Parent-child with inherited filter:
```tsx
<div className="wrapper-with-filter">  {/* Filter affects children */}
  <Button>Content</Button>  {/* Inherits filter, text looks bad */}
</div>
```

#### Animation Details

Both variants animate gradient angle from 135° to 315° on hover:
- `--ai-button-angle` CSS variable drives rotation
- Hero: Both border gradient AND inner gradient rotate together
- Hero-outline: Border gradient rotates, inner stays white
- Filters transition smoothly (hero-outline: saturate/brightness, hero: drop-shadow intensity)
- Duration: 300ms with `easeOutCubic` easing
