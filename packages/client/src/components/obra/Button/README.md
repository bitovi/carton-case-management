# Button

A versatile button component supporting multiple visual variants, sizes, roundness options, and optional icons.

## Overview

The Button component provides 6 visual variants, 4 sizes, and 2 roundness options, creating 48 possible visual combinations. It supports optional left/right icons and handles all interaction states (hover, active, focus, disabled) through CSS.

## Color Variables

The Button component uses Tailwind's semantic color system with CSS variables defined in `index.css`:

| Tailwind Class | CSS Variable | Hex Value | Usage |
|----------------|--------------|-----------|-------|
| `bg-primary` | `--primary` | #0f172a | Primary button background |
| `text-primary-foreground` | `--primary-foreground` | #f8fafc | Primary button text |
| `bg-secondary` | `--secondary` | #f1f5f9 | Secondary button background |
| `text-secondary-foreground` | `--secondary-foreground` | #0f172a | Secondary button text |
| `bg-destructive` | `--destructive` | #dc2626 | Destructive button color |
| `text-destructive-foreground` | `--destructive-foreground` | #fafafa | Destructive button text |
| `border-border` | `--border` | #cbd5e1 | Outline border |
| `bg-accent` | `--accent` | #f1f5f9 | Hover background for ghost/outline |
| `text-muted-foreground` | `--muted-foreground` | #334155 | Ghost muted text color |
| `ring-ring` | `--ring` | #cbd5e1 | Focus ring color |

These colors automatically adapt to dark mode when the `.dark` class is applied to the root element.

## Typography

| Size | Font Size | Line Height | Letter Spacing | Font Weight |
|------|-----------|-------------|----------------|-------------|
| Large/Regular/Small | 14px | 21px | 0.5px | 600 (Semibold) |
| Mini | 12px | 16px | 1.5px | 600 (Semibold) |

Font Family: Inter (var(--font-definitions/font-family-body))

## Spacing

- Icon gap: 8px (semantic/xs) between icon and text
- Border radius (default): 8px (semantic/rounded-lg)
- Border radius (round): 9999px (semantic/rounded-full)

## Usage
