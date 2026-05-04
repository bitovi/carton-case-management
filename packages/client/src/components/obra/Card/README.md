# Card

A flexible Card component with automatic slot detection. Renders 1, 2, or 3 content areas based on which props you provide (header, main, footer).

## Usage Example

```tsx
import { Card } from '@/components/obra/Card';

// 1-slot card (just main)
<Card main={<Content />} />

// 2-slots card (header + main)
<Card
  header={<Header />}
  main={<Content />}
/>

// 3-slots card (header + main + footer)
<Card
  header={<Header />}
  main={<Content />}
  footer={<Footer />}
/>

// Also works with any combination
<Card main={<Content />} footer={<Actions />} />
```
