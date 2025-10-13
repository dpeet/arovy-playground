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
- `AIButton`: Full AI action buttons with 2 variants (combined/outline) and shared gradient styling

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
<AIButton variant="combined" size="large">
  Summarize with AI
</AIButton>

// Secondary AI button
<AIButton variant="outline">
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
