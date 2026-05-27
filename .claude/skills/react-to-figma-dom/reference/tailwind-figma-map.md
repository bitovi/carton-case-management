# Tailwind CSS → Figma Property Mapping

Use this table to translate Tailwind classes from component source code and computed styles into Figma Plugin API properties.

## Layout

| Tailwind | Figma Property | Value |
|----------|---------------|-------|
| `flex-col` | `layoutMode` | `'VERTICAL'` |
| `flex` / `flex-row` | `layoutMode` | `'HORIZONTAL'` |
| `inline-flex` | `layoutMode` | `'HORIZONTAL'` |
| `items-center` | `counterAxisAlignItems` | `'CENTER'` |
| `items-start` | `counterAxisAlignItems` | `'MIN'` |
| `items-end` | `counterAxisAlignItems` | `'MAX'` |
| `justify-between` | `primaryAxisAlignItems` | `'SPACE_BETWEEN'` |
| `justify-center` | `primaryAxisAlignItems` | `'CENTER'` |
| `justify-start` | `primaryAxisAlignItems` | `'MIN'` |
| `justify-end` | `primaryAxisAlignItems` | `'MAX'` |

## Spacing

| Tailwind | Figma Property | Value |
|----------|---------------|-------|
| `gap-{n}` | `itemSpacing` | `n * 4` px |
| `gap-x-{n}` | `itemSpacing` (HORIZONTAL layout) | `n * 4` |
| `gap-y-{n}` | `counterAxisSpacing` or `itemSpacing` (VERTICAL) | `n * 4` |
| `p-{n}` | all paddings | `n * 4` |
| `px-{n}` | `paddingLeft` / `paddingRight` | `n * 4` |
| `py-{n}` | `paddingTop` / `paddingBottom` | `n * 4` |
| `pt-{n}` | `paddingTop` | `n * 4` |
| `pb-{n}` | `paddingBottom` | `n * 4` |
| `pl-{n}` | `paddingLeft` | `n * 4` |
| `pr-{n}` | `paddingRight` | `n * 4` |

## Border Radius

| Tailwind | Figma `cornerRadius` | Pixels |
|----------|---------------------|--------|
| `rounded-none` | `0` | 0 |
| `rounded-sm` | `2` | 2 |
| `rounded` | `4` | 4 |
| `rounded-md` | `6` | 6 |
| `rounded-lg` | `8` | 8 |
| `rounded-xl` | `12` | 12 |
| `rounded-2xl` | `16` | 16 |
| `rounded-full` | `9999` | 9999 |

## Typography

| Tailwind | `fontSize` | `lineHeight` (pixels) |
|----------|-----------|----------------------|
| `text-xs` | `12` | `16` |
| `text-sm` | `14` | `20` |
| `text-base` | `16` | `24` |
| `text-lg` | `18` | `28` |
| `text-xl` | `20` | `28` |
| `text-2xl` | `24` | `32` |
| `text-3xl` | `30` | `36` |

| Tailwind | Font Style |
|----------|-----------|
| `font-normal` | `'Regular'` |
| `font-medium` | `'Medium'` |
| `font-semibold` | `'Semi Bold'` |
| `font-bold` | `'Bold'` |

## Sizing

| Tailwind | Figma Property | Value |
|----------|---------------|-------|
| `w-full` / `flex-1` | `layoutSizingHorizontal` | `'FILL'` |
| `h-full` | `layoutSizingVertical` | `'FILL'` |
| `w-[Npx]` | `resize(N, ...)` then `layoutSizingHorizontal = 'FIXED'` | explicit width |
| `h-{n}` | `resize(..., n*4)` | height hint |
| `min-w-0` | `minWidth` | `0` |
| `shrink-0` | `layoutGrow` | `0` |
| `truncate` | `textTruncation = 'ENDING'`, `maxLines = 1` | — |
| `overflow-hidden` | `clipsContent` | `true` |

## Borders & Effects

| Tailwind | Figma Property | Value |
|----------|---------------|-------|
| `border` | `strokeWeight` | `1`, `strokeAlign: 'OUTSIDE'` |
| `border-2` | `strokeWeight` | `2`, `strokeAlign: 'OUTSIDE'` |
| `border-b` | bottom stroke only | use individual stroke weights |
| `shadow-sm` | `effects` | `[{type: 'DROP_SHADOW', color: {r:0,g:0,b:0}, opacity: 0.05, offset: {x:0,y:1}, radius: 2, spread: 0, visible: true}]` |
| `shadow` | `effects` | `[{type: 'DROP_SHADOW', ...}, {type: 'DROP_SHADOW', ...}]` |
| `opacity-{n}` | `opacity` | `n / 100` |

## Icon Sizes

| Tailwind | `resize()` |
|----------|-----------|
| `h-3 w-3` / `size-3` | `12, 12` |
| `h-4 w-4` / `size-4` | `16, 16` |
| `h-5 w-5` / `size-5` | `20, 20` |
| `h-6 w-6` / `size-6` | `24, 24` |

## Important Notes

- `strokeAlign` must ALWAYS be `'OUTSIDE'` to match CSS box model (CSS borders are outside by default)
- Colors are 0–1 range, NOT 0–255. Divide RGB values by 255.
- `lineHeight` must be `{ value: N, unit: 'PIXELS' }` — never a bare number
- `letterSpacing` must be `{ value: N, unit: 'PIXELS' }` — never a bare number
- `counterAxisAlignItems` does NOT support `'STRETCH'` — use `'MIN'` + child `layoutSizingHorizontal = 'FILL'` instead
