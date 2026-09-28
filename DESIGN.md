# Velociclos PCM - Design System

> Research-first design for a trading automation education platform.

## Design Brief

```text
Designing Velociclos PCM — an automation trading platform for MetaTrader 5 — for professional traders and investors on web.
Goal: Convert visitors to paying course subscribers and build trust with technical audiences.
Tone: Precise, technical, trustworthy, high-performance.
Main objection/risk: Perception of "get-rich-quick" schemes vs. credible automation tools.
Must remember: This is a professional tool, not a lifestyle product.
Research needed: styles for professional SaaS fintech, screens for dashboard/education UI, flows for signup-to-subscription.
Path: Direct build with visual exploration for hero section.
```

## Visual Direction

### Primary Reference: Mercury (Banking-at-blue-hour)

- **Canvas:** Deep charcoal/near-black background (#0a0a0a) with lighter surfaces (#171717) for elevation
- **Type:** Inter (system sans-serif) — technical, neutral, highly readable for data
- **Accent:** Electric blue (#2563eb) for primary actions, teal (#0d9488) for secondary
- **Density:** Medium — tables and charts need space, but not airy marketing
- **Media:** Actual trading charts, screenshots of MetaTrader 5 integration, product footage
- **Distinctive detail:** Gradient accents on CTA buttons (blue → teal), glassmorphism panels for overlays

### Borrowed Details

- From Ramp: Financial data tables with proper number alignment, color-coded gains/losses
- From Superhuman: Clean keyboard shortcuts, responsive command palette

### Token Commitments

| Token | Value | Role |
|-------|-------|------|
| `--color-bg` | `#0a0a0a` | Canvas |
| `--color-surface` | `#171717` | Cards, panels |
| `--color-surface-elevated` | `#242424` | Elevated content |
| `--color-text-primary` | `#f5f5f5` | Body, headlines |
| `--color-text-secondary` | `#a1a1a1` | Descriptions, labels |
| `--color-text-tertiary` | `#737373` | Captions, footnotes |
| `--color-border` | `rgba(255,255,255,0.08)` | Dividers |
| `--color-border-strong` | `rgba(255,255,255,0.15)` | Inputs, cards |
| `--color-primary` | `#3b82f6` | Primary actions |
| `--color-primary-hover` | `#60a5fa` | Hover states |
| `--color-primary-active` | `#2563eb` | Active state |
| `--color-accent-teal` | `#0d9488` | Secondary actions |
| `--color-success` | `#10b981` | Gains, positive |
| `--color-danger` | `#ef4444` | Losses, errors |
| `--color-warning` | `#f59e0b` | Warnings |
| `--radius-sm` | `4px` | Inputs, small elements |
| `--radius-md` | `8px` | Cards, modal content |
| `--radius-lg` | `12px` | Hero sections, large panels |
| `--radius-xl` | `16px` | Glassmorphism overlays |
| `--shadow` | `0 4px 20px rgba(0,0,0,0.4)` | Light mode shadow |
| `--glass-light` | `rgba(255,255,255,0.05)` | Glass panel tint |

### Typography

- **Font family:** Inter (loaded via Google Fonts with `font-display: swap`)
- **Scale:** Minor Third (1.200)
- **Base size:** 16px
- **Line height:** 1.55 for body, 1.15 for headings
- **Weights:** 400 (body), 500 (labels/CTA), 600 (subheadings), 700 (headlines)
- **Letter spacing:** 0.08em for ALL CAPS, 0.015em for captions (12px)

### Color Roles (Strict Token System)

| Purpose | Light Mode | Dark Mode |
|---------|------------|-----------|
| Canvas | `#ffffff` | `#0a0a0a` |
| Surface-1 | `#f7f7f7` | `#171717` |
| Surface-2 | `#f0f0f0` | `#1f1f1f` |
| Primary | `#2563eb` | `#60a5fa` |
| Text-primary | `#111111` | `#f5f5f5` |
| Text-secondary | `rgba(0,0,0,0.65)` | `#a1a1a1` |
| Border | `#e5e5e5` | `rgba(255,255,255,0.08)` |

### Anti-AI-Slop Compliance

- ❌ No indigo/violet as primary — using electric blue + teal
- ❌ Cards are for interaction only — not decorative wrappers
- ❌ Dark mode is intentional (fintech), not default by accident
- ❌ No emoji as icons — using Lucide React
- ❌ No decorative left accent stripes — only for status indicators
- ✅ ONE primary accent (blue), ONE secondary (teal), semantics for success/danger
- ✅ Glassmorphism is justified — used for overlay panels, not entire sections

## Product Patterns

### Landing Page Structure

1. **Hero** with: Product screenshot in dark themed frame, headline (32px mobile / 48px desktop), CTA buttons
2. **Video showcase** with autoplay demo (muted, looped)
3. **Features** in 3-column grid (not cards — just sections with icons)
4. **Social proof** with trading results (actual performance charts)
5. **Pricing** with toggle (monthly/annual) — 2 tiers (Pro, Enterprise)
6. **FAQ** accordion (no cards)
7. **Final CTA** with urgency

### Dashboard Layout

- Dark theme with charcoal background
- Left sidebar navigation with icons
- Main content area with data tables
- Number columns right-aligned with tabular-nums
- Positive/negative values in green/red

### Course UI

- Course catalog: 2-column grid on desktop, list on mobile
- Lesson: Video player with sidebar navigation
- Progress: Circular progress bar
- Certificates: Downloadable .ex5 file with preview modal

## Decision Ledger

| Decision | Source | Source Rule | Why |
|----------|--------|-------------|-----|
| Dark theme | Mercury reference + fintech domain | Dark mode is brand choice, not default | Professional trading UIs use dark themes for reduced eye strain during long sessions |
| Electric blue accent (#2563eb) | Mercury/Mercury financial design references | CTA-only accent color | Trust, stability, professional — not AI-default indigo |
| Inter font | Typography guide safe preset | One font + multiple weights | Technical product needs clarity over decoration |
| Glassmorphism panels | Existing project design | Image-led references preserved with intentional placeholder | Used as overlay for modals/modals only — not decorative cards |
| Tabular numbers in data tables | Typography guide | Tabular figures for tables/stats/prices | Aligns columns of numbers automatically |
| Number alignment (right) | Mercury dashboard patterns | Data table best practices | Standard for financial data readability |
| `color-scheme: dark` on `<html>` | Color guide dark mode section | Fixes scrollbars, form controls, system dialogs | Required for proper native UI elements in dark mode |

## Components

### Button

- Primary: Blue background with white text, hover darkens
- Secondary: Transparent with blue border, hover gets blue background
- All caps: letter-spacing 0.08em
- Duration: hover 120ms, press 90ms

### Input

- Charcoal background (#171717) with border (#242424)
- Focus ring: Blue glow outer, 2px
- Small text (12px) labels with 0.015em tracking

### Card (Interaction Only)

Used for:
- Course lessons (clickable)
- Certificate items (clickable)
- Dashboard widgets (interactive)

Not used for:
- Feature descriptions (sections only)
- Pricing tiers (columns only)

### Glass Panel

For modal overlays in hero video player:
```
background: rgba(15, 15, 15, 0.7)
backdrop-filter: blur(12px)
border: 1px solid rgba(255, 255, 255, 0.1)
border-radius: 12px
```

### Data Table

- Right-aligned number columns
- Color-coded positive (green) / negative (red)
- `font-variant-numeric: tabular-nums`
- No row hover animation (keep it fast)

## Motion Tokens

```css
:root {
  --duration-fast: 120ms;
  --duration-default: 200ms;
  --duration-slow: 320ms;
  
  --ease-out: cubic-bezier(0.0, 0.0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0.0, 1, 1);
  --ease-in-out: cubic-bezier(0.4, 0.0, 0.2, 1);
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Quality Gate

| Check | Status |
|-------|--------|
| Used styles for visual taste | ✅ Mercury dark banking |
| Avoided copying one style | ✅ Combined Mercury + Ramp |
| Synthesized multiple references | ✅ Banking dark + financial data patterns |
| Avoided averaging references | ✅ Kept sharp dark theme + blue accent |
| Preserved primary reference's signature traits | ✅ Deep charcoal canvas, blue CTA, tabular data |
| Used screens for concrete UI | ✅ Dashboard, table, course catalog patterns |
| Named influencing references | ✅ Mercury, Ramp, Superhuman |
| No indigo/violet default | ✅ Electric blue + teal |
| Cards are interaction-justified | ✅ Only for clickable items |
| Typography tokens defined | ✅ 6-8 sizes, 3-4 weights, proper tracking |
| Color tokens named by purpose | ✅ bg, surface, primary, text-primary |
| Dark mode is intentional | ✅ Professional trading UI choice |
| Media roles preserved | ✅ Trading charts, MetaTrader screenshots |
| No `transition: all` | ✅ Explicit properties |
| Reduced motion handled | ✅ prefers-reduced-motion |

---

This design system is research-backed and adapted from real fintech products (Mercury, Ramp, Superhuman) for the specific context of a trading automation education platform.