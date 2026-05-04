# Label

An accessible form label component that supports both inline and block layout modes.

## Overview

The Label component provides semantic HTML labels with configurable layout behavior. It supports inline layout (for labels next to form elements) and block layout (for labels above form elements), enabling flexible form design patterns.

## Typography

- **Font Family**: Inter (var(--font-definitions/font-family-body))
- **Font Size**: Small paragraph (12-14px)
- **Font Weight**: 500 (Medium)
- **Line Height**: paragraph/small/line height
- **Letter Spacing**: 0.5px

## Usage

### Basic Label
```tsx
<Label>Email address</Label>
```

### With Form Input (Inline)
```tsx
<div className="flex items-center gap-2">
  <Label htmlFor="email" layout="inline">Email:</Label>
  <Input id="email" type="email" />
</div>
```

### With Form Input (Block)
```tsx
<div className="space-y-2">
  <Label htmlFor="username" layout="block">Username</Label>
  <Input id="username" type="text" />
</div>
```
