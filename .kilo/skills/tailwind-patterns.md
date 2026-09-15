# Tailwind CSS Skill

## Project Context
- Tailwind CSS 3.4
- Custom color palette (dark theme with gold accents)
- Next.js 15 with App Router

## Color Palette
```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#ffd700',      // Gold
          dark: '#e6c200',
          light: '#fff0a0',
        },
        dark: {
          bg: '#0f0f19',           // Main background
          card: '#1e2329',         // Card background
          border: '#2a2e39',       // Border color
          hover: '#404857',        // Hover border
        },
        text: {
          primary: '#dcdcdc',      // Main text
          secondary: '#a0a0a0',    // Secondary text
          muted: '#6b6b6b',        // Muted text
        },
      },
    },
  },
}
```

## Usage Patterns
```tsx
// Background gradients
<div className="bg-gradient-to-b from-[#0f0f19]/90 to-[#1e2329]/80" />

// Gold accent text
<span className="text-[#ffd700] font-medium">Velociclos PCM</span>

// Card styling
<div className="bg-[#2a2e39] border border-[#404857] rounded-xl" />

// Hover effects
<button className="hover:border-[#ffd700] hover:shadow-[0_0_25px_rgba(255,215,0,0.2)]" />

// Focus states
<input className="focus:ring-2 focus:ring-[#ffd700] focus:ring-offset-2 focus:ring-offset-[#1e2329]" />
```

## Responsive Grid
```tsx
// Certificate grid - 1/2/3/5 columns
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6" />

// Footer - 1/2/5 columns
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8" />
```

## Animations
```tsx
// Transition
<div className="transition-all duration-300" />

// Custom keyframes (in globals.css)
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
}
```

## Dark Mode (Class Strategy)
```js
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  // ...
}
```

```tsx
// Automatic dark (system preference)
<div className="bg-white dark:bg-[#0f0f19]">
```

## Component Patterns

### Button Variants
```tsx
// Primary
<button className="bg-[#ffd700] text-[#0f0f19] font-bold px-6 py-3 rounded-lg hover:bg-[#e6c200] transition-colors" />

// Secondary
<button className="bg-transparent border border-[#ffd700] text-[#ffd700] font-medium px-6 py-3 rounded-lg hover:bg-[#ffd700]/10 transition-colors" />

// Ghost
<button className="text-[#a0a0a0] hover:text-[#ffd700] font-medium px-4 py-2 transition-colors" />
```

### Form Inputs
```tsx
<input
  className="
    w-full px-4 py-3
    bg-[#1e2329] border border-[#404857]
    rounded-lg text-[#dcdcdc] placeholder-[#6b6b6b]
    focus:border-[#ffd700] focus:ring-2 focus:ring-[#ffd700]/20
    transition-all duration-200
  "
/>
```

### Typography
```tsx
// Hero heading
<h1 className="text-4xl sm:text-5xl font-extrabold text-[#dcdcdc] mb-6" />

// Section heading
<h2 className="text-2xl sm:text-3xl font-bold text-[#dcdcdc] mb-4" />

// Body text
<p className="text-[#a0a0a0] text-lg leading-relaxed" />

// Small muted
<p className="text-[#6b6b6b] text-sm" />
```

## Performance
- Purge unused styles automatically in production
- Use `safelist` for dynamic classes
```js
// tailwind.config.js
safelist: [
  'bg-[#ffd700]',
  'text-[#ffd700]',
  'border-[#ffd700]',
  { pattern: /grid-cols-/ },
]
```

## Custom Utilities
```css
/* globals.css */
@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
  
  .animate-in {
    animation: animate-in 0.3s ease-out;
  }
}
```