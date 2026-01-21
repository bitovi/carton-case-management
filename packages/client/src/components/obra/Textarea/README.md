# Textarea

A multi-line text input component for forms, wrapping the native `<textarea>` element with Obra styling.

## Figma Source

https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd/Obra-shadcn-ui--Community-?node-id=279-99100

## Design-to-Code Mapping

### State Mapping

| Figma State | React Implementation |
|-------------|---------------------|
| Empty | Default render (no value, no placeholder) |
| Placeholder | `placeholder` prop provided |
| Value | `value` or `defaultValue` prop provided |
| Focus | CSS `:focus-visible` pseudo-class |
| Error | `error={true}` prop |
| Error Focus | `error={true}` + CSS `:focus-visible` |
| Disabled | `disabled` prop (native HTML) |

### Variant Mappings

| Figma Variant | Figma Value | React Prop | React Value | Notes |
|---------------|-------------|------------|-------------|-------|
| Roundness | Default | `rounded` | `false` | Standard border radius |
| Roundness | Round | `rounded` | `true` | More rounded corners |

### Property Mappings

| Figma Property | React Prop | Type | Notes |
|----------------|------------|------|-------|
| showResizable | `resizable` | `boolean` | Controls CSS resize property |
| State: Error | `error` | `boolean` | Red border styling |
| State: Disabled | `disabled` | `boolean` | Native HTML attribute |

### Excluded Properties (CSS/Internal)

| Figma Property | Handling | Reason |
|----------------|----------|--------|
| State: Focus | CSS `:focus-visible` | Pseudo-state |
| State: Error Focus | CSS `:focus-visible` + `error` prop | Pseudo-state |

## Usage

### Basic

```tsx
<Textarea placeholder="Type your message here." />
```

### With Value

```tsx
const [value, setValue] = useState('');

<Textarea
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

### Error State

```tsx
<Textarea
  error
  placeholder="Required field"
  aria-describedby="error-message"
/>
<p id="error-message" className="text-sm text-destructive">
  This field is required
</p>
```

### Disabled

```tsx
<Textarea disabled value="Cannot edit" />
```

### Rounded Variant

```tsx
<Textarea rounded placeholder="Rounded corners" />
```

### Non-Resizable

```tsx
<Textarea resizable={false} placeholder="Fixed size" />
```

### With Label

```tsx
import { Label } from '@/components/obra/Label';

<div className="space-y-2">
  <Label htmlFor="message">Message</Label>
  <Textarea id="message" placeholder="Type your message..." />
</div>
```

## Accessibility

- Uses native `<textarea>` element for built-in accessibility
- `aria-invalid` is automatically set when `error={true}`
- Always provide a label via `<label>` element or `aria-label`
- Link error messages using `aria-describedby`

```tsx
<div className="space-y-2">
  <Label htmlFor="bio">Bio</Label>
  <Textarea
    id="bio"
    error
    aria-describedby="bio-error"
  />
  <p id="bio-error" className="text-sm text-destructive">
    Bio is required
  </p>
</div>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `error` | `boolean` | `false` | Shows error styling (red border) |
| `rounded` | `boolean` | `false` | Uses more rounded corners |
| `resizable` | `boolean` | `true` | Allows user to resize |
| `...native` | `TextareaHTMLAttributes` | - | All native textarea props |
