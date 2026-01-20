---
name: tailwind-utility-simplification
description: Simplify Tailwind CSS utility classes by using standard spacing scale values instead of arbitrary custom values when possible. Use when writing or reviewing Tailwind classes, especially for padding, margin, gap, and width/height utilities.
---

# Tailwind Utility Simplification

## Purpose

Ensure Tailwind utility classes are accurate to design documents while using standard Tailwind spacing scale values instead of arbitrary custom values when possible. This improves code readability and maintainability.

## When to Use This Skill

- When implementing UI from Figma designs
- When reviewing code with Tailwind utility classes
- When refactoring existing components
- Before committing changes with Tailwind classes

## Core Principles

1. **Always be accurate to the design document** - Verify exact pixel values from Figma using `mcp_figma_get_variable_defs`
2. **Simplify when possible** - Use standard Tailwind scale values instead of arbitrary values when they match the design exactly

## Tailwind Default Spacing Scale

Tailwind's default spacing scale uses a base of 4px (1 unit = 0.25rem = 4px):

| Class Value | Pixels | When to Use |
|-------------|--------|-------------|
| `0` | 0px | Zero spacing |
| `px` | 1px | 1 pixel borders/spacing |
| `0.5` | 2px | Very tight spacing |
| `1` | 4px | Extra small spacing |
| `1.5` | 6px | Between xs and sm |
| `2` | 8px | Small spacing |
| `2.5` | 10px | Between sm and md |
| `3` | 12px | Medium-small spacing |
| `3.5` | 14px | Between md-sm and md |
| `4` | 16px | Medium spacing |
| `5` | 20px | Medium-large spacing |
| `6` | 24px | Large spacing |
| `7` | 28px | Between lg and xl |
| `8` | 32px | Extra large spacing |
| `9` | 36px | 2xl spacing |
| `10` | 40px | 3xl spacing |
| `11` | 44px | Between 3xl and 4xl |
| `12` | 48px | 4xl spacing |

## Examples

### ✅ Expected Use of Custom Values

Custom values should be used when the design specifies a value NOT in Tailwind's default scale:

```tsx
// 5px is not in the standard scale (between 1=4px and 1.5=6px)
<div className="p-[5px]">

// 18px is not in the standard scale (between 4=16px and 5=20px)
<div className="w-[18px] h-[18px]">

// 21px is not in the standard scale
<div className="leading-[21px]">

// 13px is not in the standard scale
<div className="gap-[13px]">
```

### ❌ NOT Expected - Use Standard Classes Instead

```tsx
// BAD: p-[4px] - Use p-1 instead
<div className="p-[4px]">

// GOOD: Use standard Tailwind class
<div className="p-1">

// BAD: p-[16px] - Use p-4 instead
<div className="p-[16px]">

// GOOD: Use standard Tailwind class
<div className="p-4">

// BAD: gap-[8px] - Use gap-2 instead
<div className="flex gap-[8px]">

// GOOD: Use standard Tailwind class
<div className="flex gap-2">

// BAD: py-[4px] - Use py-1 instead
<div className="py-[4px]">

// GOOD: Use standard Tailwind class
<div className="py-1">

// BAD: mt-[32px] - Use mt-8 instead
<div className="mt-[32px]">

// GOOD: Use standard Tailwind class
<div className="mt-8">
```

### Mixed Example

```tsx
// Design specifies: 4px vertical padding, 8px horizontal gap, 18px icon size
// BEFORE (all arbitrary values):
<div className="flex items-center gap-[8px] py-[4px]">
  <ThumbsUp className="w-[18px] h-[18px]" />
</div>

// AFTER (simplified where possible):
<div className="flex items-center gap-2 py-1">
  <ThumbsUp className="w-[18px] h-[18px]" />
</div>
```

## Common Utility Types to Check

### Padding/Margin
- `p-[4px]` → `p-1`
- `px-[8px]` → `px-2`
- `py-[16px]` → `py-4`
- `mt-[24px]` → `mt-6`
- `mb-[12px]` → `mb-3`

### Gap (Flexbox/Grid)
- `gap-[4px]` → `gap-1`
- `gap-[8px]` → `gap-2`
- `gap-x-[16px]` → `gap-x-4`
- `gap-y-[20px]` → `gap-y-5`

### Width/Height
- `w-[16px]` → `w-4`
- `h-[32px]` → `h-8`
- Note: Icon sizes often don't match scale (e.g., `w-[18px]` is correct as-is)

### Space Between
- `space-x-[8px]` → `space-x-2`
- `space-y-[12px]` → `space-y-3`

## Workflow

When implementing or reviewing Tailwind utilities:

1. **Verify design value** - Use `mcp_figma_get_variable_defs` to get exact pixel values
2. **Check scale** - Consult the spacing scale table above
3. **Simplify if match** - Replace arbitrary value with standard class if exact match exists
4. **Keep if custom** - Use arbitrary value if no standard class matches

## Common Mistakes to Avoid

❌ **Don't** simplify values that don't exactly match the scale
```tsx
// If design specifies 5px, keep it custom:
<div className="p-1.5">  // WRONG: 1.5 = 6px, not 5px
<div className="p-[5px]"> // CORRECT
```

❌ **Don't** forget to check all dimensions
```tsx
// Check both width AND height:
<Icon className="w-4 h-[18px]" /> // Inconsistent - both should match design
```

❌ **Don't** change values without verifying against design
```tsx
// Always verify the design first - don't assume!
```

## Quick Reference: Most Common Conversions

| Arbitrary Value | Standard Class | Pixels |
|-----------------|----------------|--------|
| `[4px]` | `1` | 4px |
| `[8px]` | `2` | 8px |
| `[12px]` | `3` | 12px |
| `[16px]` | `4` | 16px |
| `[20px]` | `5` | 20px |
| `[24px]` | `6` | 24px |
| `[32px]` | `8` | 32px |

Remember: When in doubt, keep the arbitrary value. Accuracy to the design is more important than simplification.
