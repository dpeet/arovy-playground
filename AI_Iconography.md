# AI Sparkle Iconography Guidelines

Enterprise AI iconography for Arovy security workflows. Simple, accessible, and focused on clarity.

## Overview

Sparkle is the universal signal for AI across Google, Microsoft, and enterprise SaaS. Our system uses **3 core variants** plus specialized options for clear, discoverable AI indicators without visual clutter.

## Core Variants

### 1. Color (Gradient)
- **Use for**: Primary AI actions, feature highlights, hero CTAs
- **Colors**: Blue (#6EB8FF) → Orange (#FF9E78), 135deg gradient
- **Contrast**: 3:1 minimum on backgrounds (WCAG AA)

### 2. Black
- **Use for**: Secondary actions, inline indicators, table rows, data-dense views
- **Color**: #000000
- **Contrast**: Ensures 4.5:1 text contrast on all backgrounds

### 3. Disabled (Grey)
- **Use for**: Disabled states, unavailable features
- **Color**: #949494
- **Contrast**: Visually indicates non-interactive state

## Special Variants

### Circle (48x48)
- Fixed 48×48px circular container with centered 24px sparkle
- Gradient background: 90deg, #C8E4FF → #FFBFA6
- **Use for**: Feature cards, empty states, standalone icons

### Badge
- Compact badge with horizontal gradient background
- Background: 90deg, #C8E4FF → #FFBFA6
- Padding: 2px 4px, 4px border-radius
- **Use for**: Attribution labels, status indicators, AI-generated tags

### Inline
- Scales to container font size (1em)
- **Use for**: Icons next to text labels that need to match text size

## Sizing

- **Default**: 24px
- **Common sizes**: 16px, 20px, 24px, 32px, 48px
- **Circle**: Fixed 48px
- **Badge**: Auto-sized (16px icon)
- **Inline**: Container-relative (1em)

## Color Usage: 60-30-10 Rule

Apply color strategically for professional UIs:

- **60% neutral/monochrome**: Base UI, data displays, table content
- **30% secondary color**: Structure, section headers, secondary indicators
- **10% accent color**: Primary AI CTAs, active states

### Arovy Color Palette

- **Primary Gradient**: #6EB8FF → #FF9E78 (135deg) — core sparkle gradient for icons
- **Soft Gradient**: #C8E4FF → #FFBFA6 (90deg) — softer gradient for circle and badge backgrounds
- **Black**: #000000 — secondary actions, inline indicators
- **Disabled**: #949494 — unavailable features

## Context-Specific Guidelines

### Tables and Dense Data
- Default to **black** sparkle in headers, rows, cells
- Use **color** sparkle only in column headers to indicate AI capability
- Reveal color on hover for interactive elements
- **Placement**:
  - Whole table: top-right of header
  - Column header: far right (sort controls to the left)
  - Row: far left before selection controls
  - Cell: inline, left of text

### Buttons and CTAs
- **Primary buttons**: Use **black** sparkle on colored backgrounds for maximum contrast
  - Example: Blue button background with white text and black sparkle icon
- **Secondary buttons**: Use **black** sparkle on white/light backgrounds
- **Outline buttons**: Use **color** (gradient) sparkle
- **Gradient border technique**: Wrap the button with a gradient background container that provides `padding` for the visible border, keep the inner button borderless, and match border radii via CSS variables so no dark seam appears.
- Icon size: 20px for buttons, 24px for standalone actions
- Ensure 4.5:1 text contrast and 2px visible focus rings

### Labels, Tags, and Badges
- **Categorical tags**: Neutral by default
- **Status badges**: Semantic colors (red/amber/green) for state
- **AI attribution**: Use **badge** variant with gradient background
- On hover: Add border and tooltip with confidence/sources

### Inline Content and Editors
- **Dormant state**: Black sparkle; reveal color on hover
- **During generation**: Use subtle pulse animation
- **AI-generated content**: Faint border + badge variant for attribution

### Navigation and Menus
- Keep nav icons monochrome (black variant)
- Temporary accent dot badges for new AI features (30–90 days)
- Avoid persistent color in chrome

## Accessibility

### Three Required States

#### 1. AI Available (Discovery)
- Black sparkle in consistent location; color on hover
- Tooltip describes capability in plain language

```jsx
<button aria-label="Generate with AI">
  <AISparkleIcon variant="black" size={20} />
  Generate
</button>
```

#### 2. AI Active (Processing)
- Animated pulse or progress feedback
- Respect `prefers-reduced-motion` with non-animated fallback

```jsx
<AISparkleIcon variant="color" size={24} animate />
<div role="progressbar" aria-valuenow="45" aria-label="Generation progress: 45%" />
```

#### 3. AI Generated (Attribution)
- Persistent attribution badge with explainability
- One-click access to model, sources, confidence, limitations

```jsx
<article aria-label="AI-generated summary">
  <p>Your risk assessment summary...</p>
  <AISparkleIcon variant="badge" showLabel />
  <div role="tooltip">Generated based on 1,247 security events</div>
</article>
```

### Accessibility Checklist
- ✅ Color independence: Pair color with shape, labels, borders
- ✅ Keyboard navigation: Tab/Shift+Tab, Enter/Space, Esc
- ✅ Screen readers: Descriptive labels, aria-live for changes
- ✅ Contrast: WCAG AA (4.5:1 text, 3:1 UI components)
- ✅ Touch targets: Minimum 44×44px

## Component Implementation

### AISparkleIcon Props

```typescript
interface AISparkleIconProps {
  variant?: "color" | "black" | "disabled" | "circle" | "badge" | "inline";
  size?: number;        // default 24px (ignored for circle/badge)
  animate?: boolean;    // pulse animation for processing states
  showLabel?: boolean;  // "AI" label for badge variant (default true)
  className?: string;
}
```

### Usage Examples

```jsx
// Primary AI action (colored)
<AISparkleIcon variant="color" size={24} />

// Secondary action or inline indicator
<AISparkleIcon variant="black" size={20} />

// Disabled feature
<AISparkleIcon variant="disabled" size={20} />

// Standalone circular icon
<AISparkleIcon variant="circle" />

// Attribution badge
<AISparkleIcon variant="badge" showLabel />

// Inline with text
<span>
  Field Label <AISparkleIcon variant="inline" size={16} />
</span>

// Processing state
<AISparkleIcon variant="color" size={24} animate />

// In a button
<button>
  <AISparkleIcon variant="black" size={20} />
  Generate Summary
</button>

// In a table header
<th>
  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    <span>Field Name</span>
    <AISparkleIcon variant="color" size={16} />
  </div>
</th>

// In a table cell
<td>
  <AISparkleIcon variant="black" size={16} />
  Account Name
</td>
```

## Arovy-Specific Usage

### Core Use Cases

#### Threat Detection
- Dedicated alert panel with semantic color border
- Badge attribution with confidence score
- One-click explainability

#### Risk Scoring
- Badge variants in table columns
- Hover tooltips with confidence/sources
- On override: "Analyst Override: 8.5 (AI: 7.2)" with revert option

#### Compliance Monitoring
- Supportive sidebar with black indicators
- Escalate to semantic colors on issues

#### Recommendations
- **High confidence**: Prominent with undo
- **Medium confidence**: Secondary action
- **Low confidence**: Experimental/opt-in

### Audit and Transparency

- Full audit trail: model version, confidence, data sources, human review
- Admin controls for background AI scope and data sources
- Prominent disclaimers for high-consequence actions
- Keyboard-first and screen-reader friendly

## Quick Reference

| Variant | Size | Use Case | Example |
|---------|------|----------|---------|
| **color** | 24px (default) | Primary AI actions, feature highlights | Hero CTA, feature entry point |
| **black** | 20px | Secondary actions, inline indicators | Button icons, table rows, labels |
| **disabled** | 20px | Unavailable features | Disabled buttons/features |
| **circle** | 48px | Standalone icons | Feature cards, empty states |
| **badge** | auto | Attribution, status | "AI Generated" tags |
| **inline** | 1em | Next to text labels | Form field labels |

## Showcase

Visit `/ai-showcase` in the app to see all variants in action with interactive examples, including:
- Core variants at multiple sizes
- Circle and badge variants
- Ant Design table integration
- Inline indicators with text fields
- Button integrations
- Animated states

## Implementation Checklist

- ✅ Use **black** sparkle for secondary actions and inline indicators
- ✅ Use **color** sparkle for primary AI actions and feature highlights
- ✅ Use **disabled** sparkle for unavailable features
- ✅ Use **circle** variant for standalone icons (48×48)
- ✅ Use **badge** variant for attribution and status
- ✅ Maintain 4.5:1 text contrast and 3:1 UI contrast
- ✅ Provide keyboard navigation and focus indicators
- ✅ Add aria-labels for all AI actions
- ✅ Include tooltips with plain-language descriptions
- ✅ Show confidence scores and explainability for AI outputs
- ✅ Respect `prefers-reduced-motion` for animations
- ✅ Test with screen readers and keyboard-only navigation
