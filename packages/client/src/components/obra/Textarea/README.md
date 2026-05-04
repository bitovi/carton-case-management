# Textarea

A multi-line text input component with support for different visual states (placeholder, value, error, focus, disabled), two roundness variants (default and round), and an optional resize handle.

## Props API

```typescript
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  roundness?: 'default' | 'round';
  showResizable?: boolean;
  error?: boolean;
  placeholder?: string;
  disabled?: boolean;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
}
```

## Usage Examples

```tsx
// Basic textarea
<Textarea placeholder="Type your message here." />

// With rounded corners
<Textarea roundness="round" placeholder="Type your message here." />

// Error state
<Textarea
  error
  aria-invalid={true}
  aria-describedby="error-message"
  placeholder="Type your message here."
/>

// Disabled
<Textarea disabled value="Value" />

// Non-resizable
<Textarea showResizable={false} placeholder="Fixed size textarea" />

// Controlled with error handling
<Textarea
  value={message}
  onChange={(e) => setMessage(e.target.value)}
  error={!!errors.message}
  roundness="round"
  placeholder="Enter your message"
/>
```
