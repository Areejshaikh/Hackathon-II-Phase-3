# Data Model: Design Tokens for Premium Visual Overhaul

## Color Tokens

### Primary Colors
- `primary-50`: #f0f9ff
- `primary-100`: #e0f2fe
- `primary-200`: #bae6fd
- `primary-300`: #7dd3fc
- `primary-400`: #38bdf8
- `primary-500`: #0ea5e9
- `primary-600`: #0284c7
- `primary-700`: #0369a1
- `primary-800`: #075985
- `primary-900`: #0c4a6e

### Slate Colors (Extended)
- `slate-50`: #f8fafc
- `slate-100`: #f1f5f9
- `slate-200`: #e2e8f0
- `slate-300`: #cbd5e1
- `slate-400`: #94a3b8
- `slate-500`: #64748b
- `slate-600`: #475569
- `slate-700`: #334155
- `slate-800`: #1e293b (Border color)
- `slate-900`: #0f172a

### Indigo Colors (Extended)
- `indigo-50`: #eef2ff
- `indigo-100`: #e0e7ff
- `indigo-200`: #c7d2fe
- `indigo-300`: #a5b4fc
- `indigo-400`: #818cf8
- `indigo-500`: #6366f1 (Hover border: indigo-500/30)
- `indigo-600`: #4f46e5
- `indigo-700`: #4338ca
- `indigo-800`: #3730a3
- `indigo-900`: #312e81

### Special Colors
- `background-dark`: #020617 (Deep Dark Slate)
- `glass-bg`: rgba(15, 23, 42, 0.4) (slate-900 with 40% opacity)
- `glass-border`: #1e293b (slate-800)

## Spacing Tokens

Based on Tailwind's default spacing scale:
- `spacing-1`: 0.25rem (4px)
- `spacing-2`: 0.5rem (8px)
- `spacing-3`: 0.75rem (12px)
- `spacing-4`: 1rem (16px)
- `spacing-6`: 1.5rem (24px)
- `spacing-8`: 2rem (32px)
- `spacing-12`: 3rem (48px)
- `spacing-16`: 4rem (64px)

## Typography Tokens

### Font Sizes
- `text-xs`: 0.75rem (12px)
- `text-sm`: 0.875rem (14px)
- `text-base`: 1rem (16px)
- `text-lg`: 1.125rem (18px)
- `text-xl`: 1.25rem (20px)
- `text-2xl`: 1.5rem (24px)
- `text-3xl`: 1.875rem (30px)
- `text-4xl`: 2.25rem (36px)

### Font Weights
- `font-thin`: 100
- `font-light`: 300
- `font-normal`: 400
- `font-medium`: 500
- `font-semibold`: 600
- `font-bold`: 700

### Line Heights
- `leading-tight`: 1.25
- `leading-snug`: 1.375
- `leading-normal`: 1.5
- `leading-relaxed`: 1.625
- `leading-loose`: 2

## Effect Tokens

### Backdrop Blur
- `backdrop-blur-sm`: 4px
- `backdrop-blur-md`: 8px
- `backdrop-blur-lg`: 12px

### Opacity
- `opacity-10`: 10%
- `opacity-20`: 20%
- `opacity-30`: 30% (Used for hover borders)
- `opacity-40`: 40% (Used for glass backgrounds)
- `opacity-50`: 50%

### Transition Durations
- `duration-150`: 150ms
- `duration-200`: 200ms
- `duration-300`: 300ms (Default hover transitions)

## Border Tokens

### Border Widths
- `border`: 1px (Standard border width)
- `border-2`: 2px
- `border-4`: 4px

### Border Radius
- `rounded-sm`: 0.125rem
- `rounded`: 0.25rem
- `rounded-md`: 0.375rem
- `rounded-lg`: 0.5rem
- `rounded-xl`: 0.75rem (Primary card rounding)

## Shadow Tokens

### Box Shadows
- `shadow-sm`: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
- `shadow`: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)
- `shadow-md`: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)