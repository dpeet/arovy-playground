# Repository Guidelines

## Project Structure & Module Organization
The Vite + React + Tailwind application lives in `src/`. Route-level views sit in `src/pages` (registered in `App.tsx`), reusable UI in `src/components` with design system pieces under `src/components/ui`, reusable logic in `src/hooks`, and shared helpers in `src/lib`. Static assets and the HTML shell remain in `public/` and `index.html`. Tooling configs (`vite.config.ts`, `tailwind.config.ts`, `eslint.config.js`, `tsconfig*.json`) stay at the repository root for quick adjustments.

## Build, Test, and Development Commands
- `npm install` installs dependencies (use the existing `package-lock.json`; keep `bun.lockb` in sync if you prefer Bun).  
- `npm run dev` launches the Vite dev server at `http://localhost:5173` with hot module reload for manual QA.  
- `npm run build` outputs a production bundle in `dist/`; `npm run build:dev` mirrors the build with development env variables.  
- `npm run preview` serves the built assets locally to validate production behavior.  
- `npm run lint` runs ESLint across the project; resolve warnings before pushing.

## Coding Style & Naming Conventions
Write TypeScript function components with `PascalCase` filenames (`FeatureCard.tsx`) and use `camelCase` utilities. Indent with two spaces and rely on the `@/` path alias (configured in `tsconfig.json`) for absolute imports. Tailwind classes drive styling—co-locate variants with their component and compose with `clsx` or `class-variance-authority`. Run `npm run lint` before committing and avoid introducing new `any` types without explanation.

## Testing Guidelines
Automated tests are not yet configured. When adding behavior, outline manual verification steps in your PR and exercise the dev server via `npm run dev`. If you introduce tests, prefer Vitest with Testing Library, place specs alongside source files as `ComponentName.test.tsx`, and add an `npm run test` script. Document any new tooling so future contributors can reproduce your steps.

## Commit & Pull Request Guidelines
Follow the Conventional Commits style observed in history (`feat:`, `refactor:`, `chore:`). Keep messages present-tense, imperative, and scoped (e.g., `feat: add dashboard status cards`). For PRs, include a succinct summary, link relevant issues, and attach screenshots or screen recordings when UI changes. Note configuration updates and manual test results, and ensure lint/build commands pass locally before requesting review.
