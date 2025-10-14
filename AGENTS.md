# Repository Guidelines

## Project Structure & Module Organization
The Vite + React + Tailwind app lives in `src/`. Route views in `src/pages` register through `src/App.tsx`. Shared UI sits in `src/components`, with design system primitives under `src/components/ui`; hooks live in `src/hooks`, and shared helpers in `src/lib`. Static assets and the HTML shell remain in `public/` and `index.html`. Keep tooling configs (`vite.config.ts`, `tailwind.config.ts`, `eslint.config.js`, `tsconfig*.json`) at the repository root. Co-locate any future specs next to source files as `ComponentName.test.tsx`.

## Build, Test, and Development Commands
- `npm install` honors the pinned `package-lock.json`; mirror updates to `bun.lockb` if you use Bun.
- `npm run dev` starts Vite at `http://localhost:5173` for hot-reload QA.
- `npm run build` produces the production bundle in `dist/`; `npm run build:dev` mirrors the build with development env variables.
- `npm run preview` serves the built assets locally for smoke checks.
- `npm run lint` runs ESLint; resolve warnings before committing.

## Coding Style & Naming Conventions
Write TypeScript components using `PascalCase` filenames (e.g., `FeatureCard.tsx`) and `camelCase` utilities. Use two-space indentation, ES module syntax, and the `@/` alias for absolute imports. Tailwind drives styling—compose classes with `clsx` or `class-variance-authority`, and scope variants with their owning component. Avoid new `any` types; document unavoidable ones.

## Testing Guidelines
Automated tests are not configured yet. When shipping changes, document manual verification steps and exercise the flow via `npm run dev`. If you introduce tests, prefer Vitest with Testing Library, place specs beside the source, and add an `npm run test` script. Share coverage expectations in the PR when you add the suite.

## Commit & Pull Request Guidelines
Use Conventional Commits (`feat:`, `refactor:`, `chore:`). Keep messages imperative, scoped, and under 72 characters. Pull requests should summarize changes, link issues, list manual test notes, and include screenshots or recordings for UI updates. Confirm `npm run lint` and relevant builds pass before requesting review.

## AI Component Inventory
- `AIButton`: Gradient-backed CTA supporting primary/secondary variants; adjust via CSS variables.
- `AISparkleIcon`: Sparkle accents with color, disabled, circle, badge, and inline modes for reuse across the showcase.

## IMPORTANT: AIButton Gradient Border Technique

### The Padding-Based Border Trick
The `AIButton` component uses a **wrapper-padding technique** to create gradient borders, since CSS does not natively support `border-image` with `border-radius`.

**How It Works:**
```
┌─────────────────────────────────────┐
│ Wrapper (gradient background)       │ ← Gradient shows here
│  ┌───────────────────────────────┐  │
│  │ Inner Button (solid/gradient) │  │ ← Covers center
│  │                               │  │
│  └───────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘
     ↑ Padding creates "border" effect
```

### Critical Implementation Rules

1. **Wrapper Must Have:**
   - `padding: var(--ai-border-width, 1px)` — Creates border thickness
   - `background: [gradient]` — The visible "border" color
   - `border-radius: calc(var(--ai-border-radius) + var(--ai-border-width))` — Outer radius

2. **Inner Button Must NOT Have:**
   - ❌ **NO `border` property** — Any border (even transparent) creates a dark line
   - ❌ **NO `border: 1px solid transparent`** — This breaks the effect
   - ✅ Only `border-radius: var(--ai-border-radius)` — Inner radius

3. **Why This Matters:**
   - The wrapper's `padding` creates a gap between wrapper edge and button edge
   - The wrapper's `background` shows through this gap = visual border
   - Any `border` on the inner button adds an extra layer = dark line artifact

### Example (Correct Implementation)
```scss
.aiButtonWrapper--hero {
  padding: 1px;
  background: linear-gradient(135deg, #6EB8FF, #FF9E78);
  border-radius: 7px;
}

.aiButton--hero {
  background: linear-gradient(135deg, #7FC5FF, #FFAB8C);
  border-radius: 6px;
  // NO border property here!
}
```

### Common Mistakes to Avoid
- ❌ Adding `border: 1px solid transparent` to inner button
- ❌ Using CSS `mask-composite` technique (complex and unreliable)
- ❌ Forgetting to remove border when debugging
- ✅ Keep wrapper padding = border thickness
- ✅ Keep inner button border-free
