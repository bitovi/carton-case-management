# Tooltip

A compound component system that displays contextual information in a popover when hovering over a trigger element. The tooltip can be positioned on any of the four sides (top, bottom, left, right) relative to its trigger, with an arrow pointing to the trigger element.

## Component Structure

This is a compound component pattern with four sub-components:

1. **TooltipProvider** - Context provider for managing tooltip state
2. **Tooltip** - Main container that coordinates trigger and content
3. **TooltipTrigger** - The interactive element that triggers the tooltip
4. **TooltipContent** - The actual tooltip popover with positioning

## Typography & Styling

- **Font**: Inter Regular
- **Font size**: 12px (`text-xs`)
- **Line height**: 16px
- **Letter spacing**: 0.18px (handled by design system)
- **Background**: Dark/black (`bg-popover`)
- **Text color**: White (`text-popover-foreground`)
- **Border radius**: Rounded (`rounded-md`)
- **Padding**: `px-3 py-1.5`
- **Shadow**: `shadow-md`

## Usage Examples

### Basic Tooltip

```tsx
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>Hover me</TooltipTrigger>
    <TooltipContent side="top">
      Tooltip text
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

### Tooltip on Button

```tsx
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="outline" size="icon">
        <InfoIcon />
      </Button>
    </TooltipTrigger>
    <TooltipContent side="bottom">
      More information about this action
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

### Multiple Tooltips (Shared Provider)

```tsx
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>First</TooltipTrigger>
    <TooltipContent>First tooltip</TooltipContent>
  </Tooltip>

  <Tooltip>
    <TooltipTrigger>Second</TooltipTrigger>
    <TooltipContent side="right">Second tooltip</TooltipContent>
  </Tooltip>
</TooltipProvider>
```

### Controlled Tooltip

```tsx
<TooltipProvider>
  <Tooltip open={isOpen} onOpenChange={setIsOpen}>
    <TooltipTrigger>Controlled</TooltipTrigger>
    <TooltipContent>This tooltip is controlled</TooltipContent>
  </Tooltip>
</TooltipProvider>
```

## Accessibility

- Supports keyboard navigation (focus on trigger shows tooltip)
- Includes proper ARIA attributes
- Screen reader compatible
- ESC key dismisses tooltip
- Works with `asChild` for semantic HTML

## Related Components

- [Button](/packages/client/src/components/obra/Button) - Often used as trigger element
- All obra components that might need tooltips for additional context
