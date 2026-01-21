# Card

A versatile container component for displaying grouped content with optional header, content, and footer sections.

## Figma Source

https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd/Obra-shadcn-ui--Community-?node-id=288-122714&m=dev

## Component Structure

The Card follows a compound component pattern with six sub-components:

| Component | Purpose |
|-----------|---------|
| `Card` | Outer container with border, shadow, and rounded corners |
| `CardHeader` | Container for title and description with proper spacing |
| `CardTitle` | Title text with semibold typography |
| `CardDescription` | Subtitle/description with muted styling |
| `CardContent` | Main content area with padding |
| `CardFooter` | Footer section for actions and metadata |

## Design-to-Code Mapping

### Figma Slot Variants

| Figma Variant | React Implementation | Node ID |
|---------------|---------------------|---------|
| 1 Slot | `Card` + `CardContent` only | `55:4701` |
| 2 Slots | `Card` + `CardHeader` + `CardContent` | `179:29232` |
| 3 Slots | `Card` + `CardHeader` + `CardContent` + `CardFooter` | `179:29233` |

### Component Mappings

| Figma Property | React Component | Notes |
|----------------|-----------------|-------|
| Header slot content | `CardHeader` children | Typically `CardTitle` + `CardDescription` |
| Main slot content | `CardContent` children | Any content |
| Footer slot content | `CardFooter` children | Buttons, badges, metadata |

### Design Token Mappings

| Figma Token | CSS/Tailwind | Value |
|-------------|--------------|-------|
| `--card/card` | `bg-card` | white |
| `--general/border` | `border` | #e5e5e5 |
| `--rounded-lg` | `rounded-lg` | 8px |
| `shadow-sm` | `shadow-sm` | Small drop shadow |
| `--xl` (padding) | `p-6` | 24px |
| `--2xs` (gap) | `gap-1` | 4px |

### Typography Mappings

| Figma Style | Component | Tailwind |
|-------------|-----------|----------|
| paragraph/bold | `CardTitle` | `text-base font-semibold` |
| paragraph small/regular | `CardDescription` | `text-sm text-muted-foreground` |

## Usage Examples

### Simple Card (1 Slot equivalent)

```tsx
<Card>
  <CardContent>
    <p>Simple content here</p>
  </CardContent>
</Card>
```

### Card with Header (2 Slots equivalent)

```tsx
<Card>
  <CardHeader>
    <CardTitle>Contact us</CardTitle>
    <CardDescription>
      Contact us and we'll get back to you as soon as possible.
    </CardDescription>
  </CardHeader>
  <CardContent>
    {/* Form fields here */}
  </CardContent>
</Card>
```

### Full Card with Footer (3 Slots equivalent)

```tsx
<Card>
  <CardHeader>
    <CardTitle>Login to your account</CardTitle>
    <CardDescription>
      Enter your email below to login to your account
    </CardDescription>
  </CardHeader>
  <CardContent>
    {/* Form fields here */}
  </CardContent>
  <CardFooter>
    <p>Don't have an account? <a href="#">Sign up</a></p>
  </CardFooter>
</Card>
```

### Card with Image

```tsx
<Card>
  <CardHeader>
    <CardTitle>Property Listing</CardTitle>
    <CardDescription>This is a card with an image.</CardDescription>
  </CardHeader>
  <CardContent className="p-0">
    <img src="/image.jpg" alt="Property" className="w-full" />
  </CardContent>
  <CardFooter className="justify-between">
    <div className="flex gap-2">
      <Badge>For Sale</Badge>
      <Badge>Featured</Badge>
    </div>
    <span className="font-semibold">$135,000</span>
  </CardFooter>
</Card>
```

## Accepted Design Differences

| Category | Figma | Implementation | Reason |
|----------|-------|----------------|--------|
| Title size | 16px | `text-base` (16px) | Exact match |
| Header gap | 4px | `gap-1` (4px) | Exact match |
| Padding | 24px | `p-6` (24px) | Exact match |

## Related Figma Examples

| Example | Description | Node ID |
|---------|-------------|---------|
| Contact Form | Header + form fields | `288:131164` |
| Login Form | Header + content + footer | `288:131167` |
| Image Card | Header + image + footer with badges | `288:131165` |
| Meeting Notes | Header + rich text content | `288:166985` |
